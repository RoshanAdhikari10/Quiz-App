import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video'; // Import react-native-video

const IntroScreen = ({ navigation }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 10000); // Navigate after 10 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/introwelcome.mp4')} // path to your video
        style={styles.video}
        resizeMode="cover"
        muted={true}
        repeat={false}
        onEnd={() => navigation.replace('MainTabs')} // Navigate when video ends
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
  },
});

export default IntroScreen;
