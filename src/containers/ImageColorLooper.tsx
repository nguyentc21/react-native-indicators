import { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  cancelAnimation,
  interpolateColor,
} from 'react-native-reanimated';

import {
  generateColorLooperInputRange,
  getColorLooperProgress,
} from '../functions';

import type { ImageProps } from 'react-native';
import type { ColorLooperProps } from '../types';

type ImageColorLooperProps = ColorLooperProps &
  ImageProps & {
    source: ImageProps['source'];
    size?: number;
  };

const AnimatedImage = Animated.createAnimatedComponent(Image);

function ImageColorLooper({
  source,
  groupColor = [],
  color = groupColor?.[0] || '#000000',
  duration = 1200,
  paused = false,
  size = 32,
  style,
  resizeMode = 'contain',
  ...restProps
}: ImageColorLooperProps) {
  const progress = useSharedValue(0);
  const inputRangeShared = useSharedValue<number[]>([]);
  const outoutRangeShared = useSharedValue<string[]>([
    ...groupColor,
    groupColor[0] || '',
  ]);
  const groupColorLength = groupColor.length;

  const animatedProps = useAnimatedProps(() => {
    if (inputRangeShared.value.length < 2 || outoutRangeShared.value.length < 2)
      return { tintColor: color };
    const tintColor = interpolateColor(
      progress.value,
      inputRangeShared.value,
      outoutRangeShared.value
    );
    return { tintColor };
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
  }, [duration, paused, groupColorLength]);

  useEffect(() => {
    if (!groupColor) return;
    const palette = [...groupColor, groupColor[0] || ''];
    inputRangeShared.value = generateColorLooperInputRange(palette);
    outoutRangeShared.value = palette;
  }, [groupColor]);

  return (
    <AnimatedImage
      {...restProps}
      source={source}
      animatedProps={animatedProps}
      // @ts-ignore
      style={[{ width: size, height: size }, style]}
      resizeMode={resizeMode}
    />
  );
}

export default ImageColorLooper;
