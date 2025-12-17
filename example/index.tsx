import { View, Text, StyleSheet } from 'react-native';

import {
  ActivityIndicator,
  AsteriskIndicator,
  BallIndicator,
  BarIndicator,
  BullEyeIndicator,
  DotIndicator,
  PulseIndicator,
  WaveIndicator,
  SpinnerContainer,
  ViewColorLooper,
  // ImageColorLooper,
} from 'Components/Indicators';

const COLOR_GROUP = ['#ffffee', '#ffccee', '#99ccee'];
const COLOR_GROUP_1 = ['blue', 'red', 'yellow', 'green'];
const COLOR_GROUP_2 = ['black', 'white'];

function TestScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.line}>
        <View style={styles.ceil}>
          <ActivityIndicator size={50} groupColor={COLOR_GROUP} />
          <Text style={styles.name}>Activity Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <AsteriskIndicator size={50} groupColor={COLOR_GROUP_1} />
          <Text style={styles.name}>Asterisk Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <BallIndicator size={50} groupColor={COLOR_GROUP_2} />
          <Text style={styles.name}>Ball Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <BarIndicator size={50} groupColor={COLOR_GROUP} />
          <Text style={styles.name}>Bar Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <BullEyeIndicator size={50} groupColor={COLOR_GROUP_1} />
          <Text style={styles.name}>Bull eye Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <DotIndicator size={12} groupColor={COLOR_GROUP_2} />
          <Text style={styles.name}>Dot Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <PulseIndicator size={50} groupColor={COLOR_GROUP} />
          <Text style={styles.name}>Pulse Indicator</Text>
        </View>
        <View style={styles.ceil}>
          <WaveIndicator size={50} groupColor={COLOR_GROUP_1} />
          <Text style={styles.name}>Wave Indicator</Text>
        </View>
      </View>
      <View style={[styles.line, { marginTop: 50 }]}>
        <View style={styles.ceil}>
          <SpinnerContainer coefficient={5} style={styles.spinner}>
            <ViewColorLooper
              groupColor={COLOR_GROUP_1}
              style={styles.spinnerContent}
            />
          </SpinnerContainer>
          <Text style={styles.name}>Spinner</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDA26B',
  },
  line: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ceil: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    marginVertical: 8,
  },
  spinner: { width: 60, height: 60 },
  spinnerContent: { width: 60, height: 20, borderRadius: 10 },
  name: {
    marginTop: 8,
    fontSize: 14,
    color: '#111111',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
});

export default TestScreen;
