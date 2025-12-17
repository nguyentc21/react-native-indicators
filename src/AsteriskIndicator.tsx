import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import ColorLooperIndicator from './containers/ColorLooperIndicator';

import { generateOutputRange } from './functions';

import type { AsteriskIndicatorProps, RenderComponentProps } from './types';

const DEFAULT_COLOR = '#000000';
const DEFAULT_COUNT = 7;
const DEFAULT_SIZE = 40;

const getInputRange = (count: number) => {
  if (!count) return [];
  return Array.from(new Array(count + 1), (_, index) => index / count);
};
const generateGetOutputRangeFunc = (count: number) => {
  if (!count) return () => [];
  const range = Array.from(new Array(count), (_, i) =>
    Math.max(1.0 - i * (1 / (count - 1)), 0)
  );
  return (index: number) => generateOutputRange(range, index);
};

function AsteriskComponent(
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
    inputRangeValue,
    getOutputRange,
    style,
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
    const opacity = interpolate(
      progress.value,
      inputRangeShared.value,
      outputRangeShared.value
    );
    return {
      opacity,
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
            width: size / 5,
            height: size / 1.8,
            borderRadius: size / 20,
          },
          style,
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
}

const AsteriskComponentMemo = React.memo(
  AsteriskComponent,
  (p, n) =>
    p.count === n.count &&
    p.index === n.index &&
    p.size === n.size &&
    p.progress === n.progress &&
    p.inputRangeValue === n.inputRangeValue &&
    p.getOutputRange === n.getOutputRange &&
    p.style === n.style
);

function AsteriskIndicator(props: AsteriskIndicatorProps) {
  const {
    count = DEFAULT_COUNT,
    color = DEFAULT_COLOR,
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
        <AsteriskComponentMemo
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
    [size, inputRangeValue, getOutputRange]
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

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default AsteriskIndicator;
