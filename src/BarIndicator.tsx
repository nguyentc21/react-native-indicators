import React, { useMemo, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

import ColorLooperIndicator from './containers/ColorLooperIndicator';

import { generateOutputRange } from './functions';
import styles from './styles';

import type { BarIndicatorProps, RenderComponentProps } from './types';

const DEFAULT_COLOR = '#000000';
const DEFAULT_COUNT = 5;
const DEFAULT_SIZE = 40;

const getInputRange = (count: number) => {
  if (!count) return [];
  return Array.from(new Array(count + 1), (_, index) => index / count);
};
const generateGetOutputRangeFunc = (
  base: number,
  count: number,
  samples: number
) => {
  if (!count || samples < 2) return () => [];
  const range = Array.from(
    new Array(samples),
    (_, index) => base * Math.abs(Math.cos((Math.PI * index) / (samples - 1)))
  );
  return (index: number) => {
    const shift = Math.ceil((index * samples) / count);
    return generateOutputRange(range, shift);
  };
};

function BarIndicator(
  props: Omit<RenderComponentProps, 'count'> & {
    width: number;
    height: number;
    radius: number;
    inputRangeValue: number[];
    getTopOutputRange(index: number): number[];
    getBotOutputRange(index: number): number[];
  }
) {
  const {
    index,
    progress,
    style,
    width,
    height,
    radius,
    inputRangeValue,
    getTopOutputRange,
    getBotOutputRange,
  } = props;

  const inputRangeShared = useSharedValue<number[]>([]);
  const topOutputRangeShared = useSharedValue<number[]>([]);
  const botOutputRangeShared = useSharedValue<number[]>([]);

  const animatedTopStyle = useAnimatedStyle(() => {
    if (
      inputRangeShared.value.length === 0 ||
      topOutputRangeShared.value.length === 0
    )
      return {};
    const translateY = interpolate(
      progress.value,
      inputRangeShared.value,
      topOutputRangeShared.value
    );
    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  const animatedBotStyle = useAnimatedStyle(() => {
    if (
      inputRangeShared.value.length === 0 ||
      botOutputRangeShared.value.length === 0
    )
      return {};
    const translateY = interpolate(
      progress.value,
      inputRangeShared.value,
      botOutputRangeShared.value
    );
    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  useEffect(() => {
    topOutputRangeShared.value = getTopOutputRange(index);
    botOutputRangeShared.value = getBotOutputRange(index);
  }, [index, getTopOutputRange, getBotOutputRange]);

  useEffect(() => {
    inputRangeShared.value = inputRangeValue;
  }, [inputRangeValue]);

  return (
    <View
      style={{
        height: height * 2,
        width: width,
        marginHorizontal: radius,
      }}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          },
          style,
          animatedTopStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            width,
            height,
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
          },
          style,
          animatedBotStyle,
        ]}
      />
    </View>
  );
}

const BarIndicatorMemo = React.memo(
  BarIndicator,
  (p, n) =>
    p.index === n.index &&
    p.progress === n.progress &&
    p.inputRangeValue === n.inputRangeValue &&
    p.width === n.width &&
    p.height === n.height &&
    p.radius === n.radius &&
    p.getTopOutputRange === n.getTopOutputRange &&
    p.getBotOutputRange === n.getBotOutputRange &&
    p.style === n.style
);

function BallIndicator(props: BarIndicatorProps) {
  const {
    count = DEFAULT_COUNT,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    style,
    animationDuration = 0,
    ...restProps
  } = props;

  const {
    width,
    height,
    radius,
    getTopOutputRange,
    getBotOutputRange,
    inputRangeValue,
  } = useMemo(() => {
    const frames = (60 * animationDuration) / 1000;
    let samples = 0;
    do samples += count;
    while (samples < frames);
    const width = Math.floor(size / 5),
      height = Math.floor(size / 2),
      radius = Math.ceil(width / 2);
    return {
      width,
      height,
      radius,
      getTopOutputRange: generateGetOutputRangeFunc(
        +(height - radius) / 2,
        count,
        samples
      ),
      getBotOutputRange: generateGetOutputRangeFunc(
        -(height - radius) / 2,
        count,
        samples
      ),
      inputRangeValue: getInputRange(samples),
    };
  }, [count, size, animationDuration]);

  const _renderComponent = useCallback(
    ({ index, progress, style }: RenderComponentProps) => {
      return (
        <BarIndicatorMemo
          key={index}
          index={index}
          progress={progress}
          style={style}
          inputRangeValue={inputRangeValue}
          width={width}
          height={height}
          radius={radius}
          getTopOutputRange={getTopOutputRange}
          getBotOutputRange={getBotOutputRange}
        />
      );
    },
    [
      inputRangeValue,
      width,
      height,
      radius,
      getTopOutputRange,
      getBotOutputRange,
    ]
  );

  return (
    <ColorLooperIndicator
      {...restProps}
      count={count}
      color={color}
      renderComponent={_renderComponent}
      style={[styles.container, style]}
    />
  );
}

export default BallIndicator;
