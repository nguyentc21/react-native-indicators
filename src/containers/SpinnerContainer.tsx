import React, { useCallback, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';

import Indicator from './Indicator';

import type { SpinnerContainerProps, RenderComponentProps } from '../types';

const SAMPLES = 25;
const DEFAULT_K = 3;

const defaultInputRange = Array.from(
  { length: SAMPLES + 1 },
  (_, i) => i / SAMPLES
);

const getOutputRange = (k: number) =>
  defaultInputRange.map(
    (t) =>
      360 * t + ((360 * k) / (2 * Math.PI)) * (1 - Math.cos(2 * Math.PI * t))
  );

function SpinnerContainerContent(
  props: Omit<RenderComponentProps, 'count' | 'index'> &
    Pick<SpinnerContainerProps, 'children' | 'coefficient' | 'extraValue'>
) {
  const { progress, children, coefficient = DEFAULT_K } = props;

  const outputRangeShared = useSharedValue<number[]>([]);

  const animatedStyle = useAnimatedStyle(() => {
    if (outputRangeShared.value.length < 2) return {};
    const rotate = interpolate(
      progress.value,
      defaultInputRange,
      outputRangeShared.value
    );
    return {
      transform: [{ rotate: rotate + 'deg' }],
    };
  });

  useEffect(() => {
    outputRangeShared.value = getOutputRange(coefficient);
  }, [coefficient]);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

const SpinnerContainerContentMemo = React.memo(
  SpinnerContainerContent,
  (p, n) =>
    p.progress === n.progress &&
    p.extraValue === n.extraValue &&
    p.coefficient === n.coefficient
);

function SpinnerContainer(props: SpinnerContainerProps) {
  const { children, extraValue, coefficient = DEFAULT_K, ...restProps } = props;

  const _renderComponent = useCallback(
    ({ index, progress }: RenderComponentProps) => {
      return (
        <SpinnerContainerContentMemo
          key={index}
          coefficient={coefficient}
          progress={progress}
          extraValue={extraValue}
        >
          {children}
        </SpinnerContainerContentMemo>
      );
    },
    [extraValue]
  );

  return (
    <Indicator
      animationDuration={1800}
      {...restProps}
      count={1}
      renderComponent={_renderComponent}
    />
  );
}

export default SpinnerContainer;
