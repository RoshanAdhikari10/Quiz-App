import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Linking, Platform
} from 'react-native';
import Sound from 'react-native-sound';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Enable audio playback in silent mode on iOS
Sound.setCategory('Playback');

const correctSoundFile = 'correct.mp3';
const incorrectSoundFile = 'incorrect.mp3';
const timerSoundFile = 'timer.mp3';

const { width } = Dimensions.get('window');

export default function MixedScreen() {
  const navigation = useNavigation();
  const timerAnim = useRef(new Animated.Value(0)).current;
  const tickingSound = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [flashTimeOut, setFlashTimeOut] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
 // Directly define questions within the component
  const questions = [
        {
          text: 'What is the capital of Canada?',
          options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'],
          correctAnswer: 'Ottawa',
        },
        {
          text: 'Which planet is known as the "Red Planet"?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 'Mars',
        },
        {
          text: 'In which year did the Titanic sink?',
          options: ['1912', '1905', '1920', '1898'],
          correctAnswer: '1912',
        },
        {
          text: 'What is the largest mammal in the world?',
          options: ['Elephant', 'Blue Whale', 'Giraffe', 'Shark'],
          correctAnswer: 'Blue Whale',
        },
        {
          text: 'Who wrote the novel *1984*?',
          options: ['Aldous Huxley', 'George Orwell', 'H.G. Wells', 'J.K. Rowling'],
          correctAnswer: 'George Orwell',
        },
        {
          text: 'Who won the FIFA World Cup 2022?',
          options: ['Argentina', 'France', 'Germany', 'Brazil'],
          correctAnswer: 'Argentina',
        },
        {
          text: 'How many players are on a basketball team on the court?',
          options: ['4', '5', '6', '7'],
          correctAnswer: '5',
        },
        {
          text: 'What sport is known as the "king of sports"?',
          options: ['Football', 'Basketball', 'Cricket', 'Tennis'],
          correctAnswer: 'Football',
        },
        {
          text: 'In which country did the Olympic Games originate?',
          options: ['Greece', 'Rome', 'France', 'USA'],
          correctAnswer: 'Greece',
        },
        {
          text: 'Who holds the record for the most goals in international football?',
          options: ['Cristiano Ronaldo', 'Lionel Messi', 'Pele', 'Ali Daei'],
          correctAnswer: 'Cristiano Ronaldo',
        },
        {
          text: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'Hyper Tool Markup Language', 'Home Tool Markup Language', 'High Text Markup Language'],
          correctAnswer: 'Hyper Text Markup Language',
        },
        {
          text: 'Who is the founder of Microsoft?',
          options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page'],
          correctAnswer: 'Bill Gates',
        },
        {
          text: 'What year was the first iPhone released?',
          options: ['2005', '2007', '2010', '2012'],
          correctAnswer: '2007',
        },
        {
          text: 'What programming language is known for its snake logo?',
          options: ['Java', 'C++', 'Python', 'Ruby'],
          correctAnswer: 'Python',
        },
        {
          text: 'Which company owns Android?',
          options: ['Apple', 'Microsoft', 'Google', 'Amazon'],
          correctAnswer: 'Google',
        },
        {
          text: 'What gas do plants absorb from the atmosphere?',
          options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
          correctAnswer: 'Carbon Dioxide',
        },
        {
          text: 'What is the boiling point of water in Celsius?',
          options: ['90°C', '95°C', '100°C', '105°C'],
          correctAnswer: '100°C',
        },
        {
          text: 'How many bones are in the adult human body?',
          options: ['206', '210', '212', '220'],
          correctAnswer: '206',
        },
        {
          text: 'What part of the cell contains genetic material?',
          options: ['Nucleus', 'Mitochondria', 'Cytoplasm', 'Golgi Apparatus'],
          correctAnswer: 'Nucleus',
        },
        {
          text: 'What’s the chemical symbol for gold?',
          options: ['Ag', 'Au', 'Pb', 'Fe'],
          correctAnswer: 'Au',
        },
        {
          text: 'Who played Iron Man in the Marvel movies?',
          options: ['Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo', 'Chris Evans'],
          correctAnswer: 'Robert Downey Jr.',
        },
        {
          text: 'Which movie won Best Picture at the Oscars in 2023?',
          options: ['Everything Everywhere All at Once', 'Top Gun: Maverick', 'Avatar: The Way of Water', 'The Fabelmans'],
          correctAnswer: 'Everything Everywhere All at Once',
        },
        {
          text: 'What is the name of Harry Potter’s pet owl?',
          options: ['Hedwig', 'Errol', 'Scabbers', 'Crookshanks'],
          correctAnswer: 'Hedwig',
        },
        {
          text: 'Who sang the 2014 hit song *Shake It Off*?',
          options: ['Katy Perry', 'Taylor Swift', 'Ariana Grande', 'Lady Gaga'],
          correctAnswer: 'Taylor Swift',
        },
        {
          text: 'What is the highest-grossing movie of all time (as of 2025)?',
          options: ['Avatar', 'Avengers: Endgame', 'Titanic', 'The Lion King'],
          correctAnswer: 'Avatar',
        }
      ];

  const currentQuestion = questions[currentIndex];

  // Animate timer and start ticking when question changes
  useEffect(() => {
    if (!isAnswered) {
      startAnimateTimer();
      startTicking();
    }
    return () => stopTicking();
  }, [currentIndex, isAnswered]);

  // Countdown and auto-handle timeout
  useEffect(() => {
    if (timeLeft === 0) {
      stopTicking();
      handleAnswerTimeout();
      return;
    }
    const timer = setTimeout(() => {
      if (!isAnswered)
        setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered]);

  const startAnimateTimer = () => {
    timerAnim.setValue(0);
    Animated.timing(timerAnim, {
      toValue: 1,
      duration: 15000,
      useNativeDriver: false
    }).start();
  };

  const playSound = (type) => {
    const file = type === 'correct' ? correctSoundFile : incorrectSoundFile;
    const sound = new Sound(file, Sound.MAIN_BUNDLE, (err) => {
      if (err) {
        console.warn('Sound load failed', err);
        return;
      }
      sound.play((success) => {
        if (!success) console.warn(`${type} sound playback failed`);
        sound.release();
      });
    });
  };

  const startTicking = () => {
    stopTicking();
    tickingSound.current = new Sound(timerSoundFile, Sound.MAIN_BUNDLE, (err) => {
      if (!err) {
        tickingSound.current.setNumberOfLoops(-1);
        tickingSound.current.play((success) => {
          if (!success) console.warn('Ticking playback failed');
        });
      }
    });
  };

  const stopTicking = () => {
    if (tickingSound.current) {
      tickingSound.current.stop();
      tickingSound.current.release();
      tickingSound.current = null;
    }
  };

  const handleOptionPress = (option) => {
    if (isAnswered) return;
    stopTicking();
    setIsAnswered(true);
    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
  };

  const handleAnswerTimeout = () => {
    setFlashTimeOut(true);
    setIsAnswered(true);
    playSound('incorrect');
    setTimeout(() => {
      setFlashTimeOut(false);
      goNext();
    }, 2000);
  };

  const goNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowRating(true);
    }
  };

  const handleRating = (value) => {
    setRating(value);
    const subject = encodeURIComponent('Feedback for Tech Quiz App');
    const body = encodeURIComponent(`Rating: ${value} stars\n\nYour feedback here...`);
    Linking.openURL(`mailto:chhetrirosun@gmail.com?subject=${subject}&body=${body}`);
  };

  const getOptionStyle = (option) => {
    if (!isAnswered) return styles.option;
    if (option === currentQuestion.correctAnswer) return styles.optionCorrect;
    if (option === selectedOption) return styles.optionWrong;
    return styles.option;
  };

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.header}>
        Mixed Quiz
      </Animatable.Text>

      {showRating ? (
        <Animatable.View animation="fadeIn" style={styles.ratingContainer}>
          <Text style={styles.question}>
            🎉 Quiz Complete! Your Score: {score}/{questions.length}
          </Text>
          <Text style={{ fontSize: 18, marginVertical: 10 }}>Rate This App:</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity key={n} onPress={() => handleRating(n)}>
                <Icon name="star" size={32} color={rating >= n ? "#FFD700" : "#ccc"} />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles.nextBtn, { marginTop: 30 }]} onPress={() => {
            setShowRating(false);
            setScore(0);
            setCurrentIndex(0);
            setTimeLeft(15);
          }}>
            <Text style={styles.nextBtnText}>Restart Quiz 🔁</Text>
          </TouchableOpacity>
        </Animatable.View>
      ) : (
        <>
          <Animatable.View animation="pulse" iterationCount="infinite" duration={1000}>
            <Text style={[styles.timerText, flashTimeOut && styles.timeoutFlash]}>
              ⏱ Time Left: {timeLeft}s
            </Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" style={styles.card}>
            <Text style={styles.questionCounter}>
              Question {currentIndex + 1}/{questions.length}
            </Text>
            <Text style={styles.question}>{currentQuestion.text}</Text>

            {currentQuestion.options.map((option, i) => (
              <Animatable.View key={i} animation="fadeInUp" delay={i * 100}>
                <TouchableOpacity
                  style={getOptionStyle(option)}
                  onPress={() => handleOptionPress(option)}
                  disabled={isAnswered}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}

            {isAnswered && (
              <Animatable.View animation="zoomIn" delay={300}>
                <TouchableOpacity onPress={goNext} style={styles.nextBtn}>
                  <Text style={styles.nextBtnText}>Next ➡️</Text>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </Animatable.View>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#333" />
      </TouchableOpacity>

      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa', 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 10 
  },
  timerText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'red', 
    marginBottom: 15 
  },
  timeoutFlash: {
    backgroundColor: '#ffe6e6',
    padding: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'red',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    width: width * 0.9,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
  },
  optionCorrect: {
    backgroundColor: '#c8e6c9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  optionWrong: {
    backgroundColor: '#ffcdd2',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  nextBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 15,
    zIndex: 1,
  },
  ratingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: width * 0.9,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 8,
  },
  scoreText: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  }
});
