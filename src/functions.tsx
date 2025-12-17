import { withRepeat, withTiming, Easing } from 'react-native-reanimated';

import type { ColorLooperProps } from './types';

const generateOutputRange = (range: number[], index: number): number[] => {
  const _p = range.length - index;
  // @ts-ignore
  if (_p < 1) return [range[range.length - 1], ...range];
  // @ts-ignore
  return [range[_p - 1], ...range.slice(-index), ...range.slice(0, _p)];
};

const generateColorLooperInputRange = (palette: string[]) => {
  const n = palette.length - 1;
  return Array.from({ length: palette.length }, (_, i) => i / n);
};

const getColorLooperProgress = (
  duration: NonNullable<ColorLooperProps['duration']>
) => withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);

export {
  generateOutputRange,
  generateColorLooperInputRange,
  getColorLooperProgress,
};
