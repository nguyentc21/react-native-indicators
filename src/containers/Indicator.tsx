import { useEffect, useMemo } from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  runOnJS,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

import type { IndicatorElementProps } from '../types';

const DEFAULT_ANIMATION_DURATION = 1200;
const DEFAULT_HIDE_ANIMATION_DURATION = 200;

function Indicator(props: IndicatorElementProps) {
  const {
    animationEasing = Easing.linear,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    hideAnimationDuration = DEFAULT_HIDE_ANIMATION_DURATION,

    animating = true,
    hidesWhenStopped = false,

    count = 1,
    renderComponent,
    style,
    contentContainerStyle,
    ..._props
  } = props;

  const animationState = useSharedValue(-99);
  const savedValue = useSharedValue(0);
  const progress = useSharedValue(0);
  const hideAnimation = useSharedValue(animating ? 1 : 0);

  const dumpArr = useMemo(() => {
    return new Array(count).fill(0);
  }, [count]);

  useEffect(() => {
    if (animating) {
      if (animationState.value === -99) {
        _startAnimation();
      } else {
        _resumeAnimation();
      }
    } else {
      _stopAnimation();
    }
    hideAnimation.value = withTiming(animating ? 1 : 0, {
      duration: hideAnimationDuration,
    });
  }, [animating]);

  const _saveAnimation = (value: number) => {
    savedValue.value = value;
    animationState.value = 0;
    if (animating) {
      _resumeAnimation();
    }
  };

  const _startAnimation = () => {
    if (animationState.value !== 0 && animationState.value !== -99) {
      return;
    }
    animationState.value = 1;
    cancelAnimation(progress);
    progress.value = withRepeat(
      withTiming(1, {
        duration: animationDuration,
        easing: animationEasing,
      }),
      -1, // Infinite
      false // not reversing
    );
  };

  const _stopAnimation = () => {
    if (animationState.value !== 1) {
      return;
    }
    animationState.value = -1;
    cancelAnimation(progress);
    _saveAnimation(progress.value);
  };

  const _resumeAnimation = () => {
    if (animationState.value !== 0) {
      return;
    }
    animationState.value = 1;
    progress.value = withTiming(
      1,
      { duration: (1 - savedValue.value) * animationDuration },
      (finished) => {
        if (!!finished) {
          progress.value = 0;
          animationState.value = 0;
          runOnJS(_startAnimation)();
        }
      }
    );
    savedValue.value = 0;
  };

  const _renderComponent = (_: any, index: number) => {
    if (typeof renderComponent === 'function') {
      return renderComponent({
        index,
        count,
        progress,
        style: contentContainerStyle,
      });
    }
    return null;
  };

  return (
    <Animated.View
      {..._props}
      // @ts-ignore
      style={[style, !!hidesWhenStopped && { opacity: hideAnimation }]}
    >
      {dumpArr.map(_renderComponent)}
    </Animated.View>
  );
}

export default Indicator;
