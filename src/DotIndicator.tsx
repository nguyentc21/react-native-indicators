import React, { useEffect, useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import ColorLooperIndicator from './containers/ColorLooperIndicator';
import styles from './styles';

import type { DotIndicatorProps, RenderComponentProps } from './types';

const DEFAULT_COLOR = '#000000';
const DEFAULT_COUNT = 4;
const DEFAULT_SIZE = 16;

const getInputRange = (index: number, count: number) => {
  if (!count) return [];
  return [
    0.0,
    (index + 0.5) / (count + 1),
    (index + 1.0) / (count + 1),
    (index + 1.5) / (count + 1),
    1.0,
  ];
};
const defaultOutputRange = [1.0, 1.36, 1.56, 1.06, 1.0];

function DotComponent(
  props: RenderComponentProps & {
    size: number;
  }
) {
  const { index, count, progress, size, style } = props;

  const inputRangeShared = useSharedValue<number[]>([]);

  const animatedStyle = useAnimatedStyle(() => {
    if (inputRangeShared.value.length === 0) return {};
    const scale = interpolate(
      progress.value,
      inputRangeShared.value,
      defaultOutputRange
    );
    return {
      transform: [{ scale }],
    };
  });

  useEffect(() => {
    inputRangeShared.value = getInputRange(index, count);
  }, [index, count]);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          margin: size / 2,
          borderRadius: size / 2,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

const DotComponentMemo = React.memo(
  DotComponent,
  (p, n) =>
    p.count === n.count &&
    p.index === n.index &&
    p.size === n.size &&
    p.progress === n.progress &&
    p.style === n.style
);

function DotIndicator(props: DotIndicatorProps) {
  const {
    color = DEFAULT_COLOR,
    count = DEFAULT_COUNT,
    size = DEFAULT_SIZE,
    style,
    ...restProps
  } = props;

  const _renderComponent = useCallback(
    ({ index, count, progress, style }: RenderComponentProps) => {
      return (
        <DotComponentMemo
          key={index}
          index={index}
          count={count}
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
      count={count}
      color={color}
      style={[styles.container, style]}
      renderComponent={_renderComponent}
    />
  );
}

export default DotIndicator;
