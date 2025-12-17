import React, { useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import ColorLooperIndicator from './containers/ColorLooperIndicator';

import type { PulseIndicatorProps, RenderComponentProps } from './types';

const DEFAULT_COLOR = '#000000';
const DEFAULT_SIZE = 40;

const defaultInputRange = [0, 0.67, 1];
const getScaleOutputRange = (index: number) =>
  index ? [0.4, 0.6, 0.4] : [0.4, 0.6, 1.0];

const getOpacityOutputRange = (index: number) =>
  index ? [1.0, 1.0, 1.0] : [0.5, 0.5, 0.0];

function PulseComponent(
  props: Omit<RenderComponentProps, 'count'> & {
    size: number;
  }
) {
  const { index, progress, size, style } = props;

  const scaleOutputRangeShared = useSharedValue<number[]>([]);
  const opacityOutputRangeShared = useSharedValue<number[]>([]);

  useEffect(() => {
    scaleOutputRangeShared.value = getScaleOutputRange(index);
    opacityOutputRangeShared.value = getOpacityOutputRange(index);
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    if (
      scaleOutputRangeShared.value.length === 0 ||
      opacityOutputRangeShared.value.length === 0
    )
      return {};
    const scale = interpolate(
      progress.value,
      defaultInputRange,
      scaleOutputRangeShared.value
    );
    const opacity = interpolate(
      progress.value,
      defaultInputRange,
      opacityOutputRangeShared.value
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={styles.layer}>
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

const PulseComponentMemo = React.memo(
  PulseComponent,
  (p, n) =>
    p.index === n.index &&
    p.size === n.size &&
    p.progress === n.progress &&
    p.style === n.style
);

function PulseIndicator(props: PulseIndicatorProps) {
  const {
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    style,
    ...restProps
  } = props;

  const _renderComponent = useCallback(
    ({ index, progress, style }: RenderComponentProps) => {
      return (
        <PulseComponentMemo
          key={index}
          index={index}
          progress={progress}
          size={size}
          style={style}
        />
      );
    },
    [size]
  );

  return (
    <ColorLooperIndicator
      {...restProps}
      count={2}
      color={color}
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

export default PulseIndicator;
