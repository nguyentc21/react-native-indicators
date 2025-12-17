import React, { useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';

import ColorLooperIndicator from './containers/ColorLooperIndicator';

import type { WaveIndicatorProps, RenderComponentProps } from './types';

const FLOAT_EPSILON = Math.pow(2, -23);
const DEFAULT_COUNT = 4;
const DEFAULT_COLOR = '#000000';
const DEFAULT_SIZE = 40;
const DEFAULT_WAVE_FACTOR = 0.54;
const DEFAULT_ANIMATION_DURATION = 1600;

const defaultScaleOutputRange = [0, 1];
const defaultOpacityOutputRange = [0, 1, 0];

function WaveComponent(
  props: Omit<RenderComponentProps, 'count'> & {
    size: number;
  } & Required<Pick<WaveIndicatorProps, 'waveFactor'>>
) {
  const { index, progress, size, waveFactor, style } = props;

  const scaleInputRangeShared = useSharedValue<number[]>([]);
  const opacityInputRangeShared = useSharedValue<number[]>([]);

  const animatedStyle = useAnimatedStyle(() => {
    if (
      scaleInputRangeShared.value.length === 0 ||
      opacityInputRangeShared.value.length === 0
    )
      return {};
    const scale = interpolate(
      progress.value,
      scaleInputRangeShared.value,
      defaultScaleOutputRange,
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      progress.value,
      opacityInputRangeShared.value,
      defaultOpacityOutputRange
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  useEffect(() => {
    const factor = Math.max(1 - Math.pow(waveFactor, index), FLOAT_EPSILON);
    scaleInputRangeShared.value = [factor, 1];
    opacityInputRangeShared.value = [0, factor, 1];
  }, [index, waveFactor]);

  return (
    <Animated.View style={[styles.layer]}>
      <Animated.View
        style={[
          {
            height: size,
            width: size,
            borderRadius: size / 2,
          },
          style,
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
}

const WaveComponentMemo = React.memo(
  WaveComponent,
  (p, n) =>
    p.index === n.index &&
    p.size === n.size &&
    p.progress === n.progress &&
    p.style === n.style &&
    p.waveFactor === n.waveFactor
);

function WaveIndicator(props: WaveIndicatorProps) {
  const {
    count = DEFAULT_COUNT,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    waveFactor = DEFAULT_WAVE_FACTOR,
    style,
    ...restProps
  } = props;

  const _renderComponent = useCallback(
    ({ index, progress, style }: RenderComponentProps) => {
      return (
        <WaveComponentMemo
          key={index}
          index={index}
          progress={progress}
          size={size}
          style={style}
          waveFactor={waveFactor}
        />
      );
    },
    [size, waveFactor]
  );

  return (
    <ColorLooperIndicator
      {...restProps}
      count={count}
      color={color}
      animationEasing={Easing.out(Easing.ease)}
      animationDuration={animationDuration}
      style={[{ width: size, height: size }, style]}
      renderComponent={_renderComponent}
    />
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WaveIndicator;
