import React, { useEffect, useCallback, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import ColorLooperIndicator from './containers/ColorLooperIndicator';

import { generateOutputRange } from './functions';
import styles from './styles';

import type { BallIndicatorProps, RenderComponentProps } from './types';

const DEFAULT_COLOR = '#000000';
const DEFAULT_COUNT = 8;
const DEFAULT_SIZE = 40;

const getInputRange = (count: number) => {
  if (!count) return [];
  return Array.from(new Array(count + 1), (_, index) => index / count);
};
const generateGetOutputRangeFunc = (count: number) => {
  if (!count) return () => [];
  const range = Array.from(
    new Array(count),
    (_, index) => 1.2 - (0.5 * index) / (count - 1)
  );
  return (index: number) => generateOutputRange(range, index);
};

function BallComponent(
  props: RenderComponentProps & {
    size: number;
    inputRangeValue: number[];
    getOutputRange(index: number): number[];
  }
) {
  const {
    index,
    count,
    progress,
    size,
    style,
    inputRangeValue,
    getOutputRange,
  } = props;

  const angle = count ? (index * 360) / count : 0;

  const inputRangeShared = useSharedValue<number[]>([]);
  const outputRangeShared = useSharedValue<number[]>([]);

  const animatedStyle = useAnimatedStyle(() => {
    if (
      inputRangeShared.value.length === 0 ||
      outputRangeShared.value.length === 0
    )
      return {};
    const scale = interpolate(
      progress.value,
      inputRangeShared.value,
      outputRangeShared.value
    );
    return {
      transform: [{ scale }],
    };
  });

  useEffect(() => {
    outputRangeShared.value = getOutputRange(index);
  }, [index, getOutputRange]);
  useEffect(() => {
    inputRangeShared.value = inputRangeValue;
  }, [inputRangeValue]);

  return (
    <Animated.View
      style={[
        styles.layer,
        {
          transform: [
            {
              rotate: angle + 'deg',
            },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          {
            margin: size / 20,
            width: size / 5,
            height: size / 5,
            borderRadius: size / 10,
          },
          style,
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
}

const BallComponentMemo = React.memo(
  BallComponent,
  (p, n) =>
    p.count === n.count &&
    p.index === n.index &&
    p.size === n.size &&
    p.progress === n.progress &&
    p.inputRangeValue === n.inputRangeValue &&
    p.getOutputRange === n.getOutputRange &&
    p.style === n.style
);

function BallIndicator(props: BallIndicatorProps) {
  const {
    color = DEFAULT_COLOR,
    count = DEFAULT_COUNT,
    size = DEFAULT_SIZE,
    style,
    ...restProps
  } = props;

  const { inputRangeValue, getOutputRange } = useMemo(
    () => ({
      inputRangeValue: getInputRange(count),
      getOutputRange: generateGetOutputRangeFunc(count),
    }),
    [count]
  );

  const _renderComponent = useCallback(
    ({ index, count, progress, style }: RenderComponentProps) => {
      return (
        <BallComponentMemo
          key={index}
          index={index}
          count={count}
          progress={progress}
          size={size}
          style={style}
          inputRangeValue={inputRangeValue}
          getOutputRange={getOutputRange}
        />
      );
    },
    [size, style, inputRangeValue, getOutputRange]
  );

  return (
    <ColorLooperIndicator
      {...restProps}
      count={count}
      color={color}
      style={[{ width: size, height: size }, style]}
      renderComponent={_renderComponent}
    />
  );
}

export default BallIndicator;
