import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
  interpolateColor,
} from 'react-native-reanimated';

import Indicator from './Indicator';

import {
  getColorLooperProgress,
  generateColorLooperInputRange,
} from '../functions';

import type { ColorLooperIndicatorProps } from '../types';

function ColorLooperIndicator({
  groupColor = [],
  color = groupColor?.[0] || '#000000',
  duration = 1200,
  paused = false,
  ...restProps
}: ColorLooperIndicatorProps) {
  const progress = useSharedValue(0);
  const inputRangeShared = useSharedValue<number[]>([]);
  const outoutRangeShared = useSharedValue<string[]>([
    ...groupColor,
    groupColor[0] || '',
  ]);
  const groupColorLength = groupColor.length;

  const animatedStyles = useAnimatedStyle(() => {
    if (inputRangeShared.value.length < 2 || outoutRangeShared.value.length < 2)
      return { backgroundColor: color };
    const _color = interpolateColor(
      progress.value,
      inputRangeShared.value,
      outoutRangeShared.value
    );
    return { backgroundColor: _color };
  });

  useEffect(() => {
    if (paused || groupColorLength < 2) {
      cancelAnimation(progress);
      return;
    }
    progress.value = getColorLooperProgress(duration * groupColorLength);
    return () => {
      cancelAnimation(progress);
    };
  }, [paused, groupColorLength, duration]);

  useEffect(() => {
    if (!groupColor) return;
    const palette = [...groupColor, groupColor[0] || ''];
    inputRangeShared.value = generateColorLooperInputRange(palette);
    outoutRangeShared.value = palette;
  }, [groupColor]);

  return <Indicator {...restProps} contentContainerStyle={animatedStyles} />;
}

export default ColorLooperIndicator;
