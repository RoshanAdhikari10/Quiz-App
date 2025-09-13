import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadName = async () => {
        try {
          const savedName = await AsyncStorage.getItem('username');
          if (savedName) {
            setUsername(savedName);
          }
        } catch (error) {
          console.error('Error loading username:', error);
        } finally {
          setLoading(false);
        }
      };
      loadName();
    }, [])
  );

const handleStartQuiz = () => {
  Vibration.vibrate(50);
  navigation.navigate('Quiz', { screen: 'QuizMain' }); // Navigates into QuizStack → QuizMain
};

  const handleChangeUser = async () => {
    await AsyncStorage.removeItem('username');
    setUsername('');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00c853" />
      ) : (
        <>
          <Animatable.View animation="fadeInDown" duration={1000} style={styles.avatarContainer}>
            <Image
              source={require('../assets/Avatar.png')} // Add your avatar image here
              style={styles.avatar}
            />
          </Animatable.View>

          <Animatable.Text animation="fadeInDown" duration={1000} style={styles.titles}>
            👋 Welcome{username ? `, ${username}` : ''}{'\n'}to the Quiz App
          </Animatable.Text>

          <Animatable.Text animation="fadeInUp" delay={500} style={styles.subText}>
            Ready to test your knowledge? 🧠
          </Animatable.Text>

          <Animatable.View animation="zoomIn" delay={1000}>
            <TouchableOpacity
              accessibilityLabel="Start Quiz Button"
              testID="startQuizButton"
              style={styles.startButton}
              onPress={handleStartQuiz}
            >
              <Text style={styles.startButtonText}>🎮 Start Quiz</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.Text animation="fadeIn" delay={1500} style={styles.quote}>
            “The more you know, the more you grow.” 🌱
          </Animatable.Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fff4',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00c853',
  },
  titles: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#40E0D0',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#00c853',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 40,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
