import type { ColorValue, ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import type { SharedValue, Easing } from 'react-native-reanimated';

type RenderComponentProps = {
  index: number;
  count: number;
  progress: SharedValue<number>;
  style?: ViewProps['style'];
};

type IndicatorElementProps = ViewProps & {
  animationEasing?: typeof Easing.linear;
  animationDuration?: number;
  hideAnimationDuration?: number;

  animating?: boolean;
  hidesWhenStopped?: boolean;

  renderComponent?(props: RenderComponentProps): ReactNode;
  count?: number;
  contentContainerStyle?: ViewProps['style'];
};

type ColorLooperProps = {
  groupColor?: string[];
  color?: ColorValue;
  duration?: number;
  paused?: boolean;
};

type ColorLooperIndicatorProps = IndicatorElementProps & ColorLooperProps;

type IndicatorLayoutProps = {
  size?: number;
  color?: ColorValue;
};

type IndicatorProps = Omit<ColorLooperIndicatorProps, 'renderComponent'> &
  IndicatorLayoutProps;

type ActivityIndicatorProps = IndicatorProps;
type AsteriskIndicatorProps = IndicatorProps;
type BallIndicatorProps = IndicatorProps;
type BarIndicatorProps = IndicatorProps;
type BullEyeIndicatorProps = IndicatorProps;
type DotIndicatorProps = IndicatorProps;
type PulseIndicatorProps = IndicatorProps;
type SnowflakeIndicatorProps = IndicatorProps;
type WaveIndicatorProps = IndicatorProps & {
  waveFactor?: number;
};

type SpinnerContainerProps = IndicatorProps & {
  children: ReactNode;
  coefficient?: number;
  extraValue?: any;
};

export type {
  IndicatorLayoutProps,
  IndicatorElementProps,
  RenderComponentProps,
  IndicatorProps,
  ActivityIndicatorProps,
  AsteriskIndicatorProps,
  BallIndicatorProps,
  BarIndicatorProps,
  BullEyeIndicatorProps,
  DotIndicatorProps,
  PulseIndicatorProps,
  SnowflakeIndicatorProps,
  WaveIndicatorProps,
  SpinnerContainerProps,
  ColorLooperProps,
  ColorLooperIndicatorProps,
};
