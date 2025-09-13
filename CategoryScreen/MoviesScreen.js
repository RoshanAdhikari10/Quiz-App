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

export default function MoviesScreen() {
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
 const questions = [
    // Add questions array here as in your original code...
    {
      text: 'Who directed the movie *Inception*?',
      options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Quentin Tarantino'],
      correctAnswer: 'Christopher Nolan',
      icon: '🎬',
    },
    {
      text: 'Which movie won Best Picture at the 2020 Oscars?',
      options: ['1917', 'Joker', 'Parasite', 'Ford v Ferrari'],
      correctAnswer: 'Parasite',
      icon: '🏆',
    },
    {
      text: 'Who played Iron Man in the Marvel Cinematic Universe?',
      options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
      correctAnswer: 'Robert Downey Jr.',
      icon: '🦾',
    },
    {
      text: 'What is the highest-grossing movie of all time (as of 2024)?',
      options: ['Avatar', 'Avengers: Endgame', 'Titanic', 'The Lion King'],
      correctAnswer: 'Avatar',
      icon: '💰',
    },
    {
      text: 'Which movie features the quote: "I’ll be back"?',
      options: ['Die Hard', 'RoboCop', 'The Terminator', 'Predator'],
      correctAnswer: 'The Terminator',
      icon: '🤖',
    },
    {
      text: 'In which movie does a clown named Pennywise appear?',
      options: ['The Conjuring', 'Annabelle', 'It', 'Sinister'],
      correctAnswer: 'It',
      icon: '🎈',
    },
    {
      text: 'Which actor voiced Woody in *Toy Story*?',
      options: ['Tom Hanks', 'Tim Allen', 'Will Smith', 'Chris Pratt'],
      correctAnswer: 'Tom Hanks',
      icon: '🤠',
    },
    {
      text: 'Which Harry Potter house does Harry belong to?',
      options: ['Ravenclaw', 'Hufflepuff', 'Slytherin', 'Gryffindor'],
      correctAnswer: 'Gryffindor',
      icon: '🧙‍♂️',
    },
    {
      text: 'Which movie is about dreams within dreams?',
      options: ['The Matrix', 'Interstellar', 'Inception', 'Shutter Island'],
      correctAnswer: 'Inception',
      icon: '🌀',
    },
    {
      text: 'Who played Jack in *Titanic*?',
      options: ['Brad Pitt', 'Tom Cruise', 'Leonardo DiCaprio', 'Matt Damon'],
      correctAnswer: 'Leonardo DiCaprio',
      icon: '🚢',
    },
    {
      text: 'Which movie is based on a Marvel superhero with a shield?',
      options: ['Iron Man', 'Black Panther', 'Captain America', 'Thor'],
      correctAnswer: 'Captain America',
      icon: '🛡️',
    },
    {
      text: 'In which movie do dinosaurs roam a theme park?',
      options: ['King Kong', 'Jurassic World', 'Jurassic Park', 'The Lost World'],
      correctAnswer: 'Jurassic Park',
      icon: '🦖',
    },
    {
      text: 'What is the name of the hobbit played by Elijah Wood?',
      options: ['Bilbo', 'Frodo', 'Sam', 'Pippin'],
      correctAnswer: 'Frodo',
      icon: '💍',
    },
    {
      text: 'Which movie features a magical nanny named Mary?',
      options: ['Nanny McPhee', 'Mary Poppins', 'Matilda', 'Enchanted'],
      correctAnswer: 'Mary Poppins',
      icon: '☂️',
    },
    {
      text: 'What color pill does Neo take in *The Matrix*?',
      options: ['Blue', 'Green', 'Red', 'Yellow'],
      correctAnswer: 'Red',
      icon: '💊',
    },
    {
      text: 'Which Disney movie features a talking snowman named Olaf?',
      options: ['Frozen', 'Tangled', 'Moana', 'Encanto'],
      correctAnswer: 'Frozen',
      icon: '⛄',
    },
    {
      text: 'What is the name of the kingdom in *Black Panther*?',
      options: ['Wakanda', 'Zamunda', 'Asgard', 'Genovia'],
      correctAnswer: 'Wakanda',
      icon: '🐾',
    },
    {
      text: 'In *Finding Nemo*, what kind of fish is Nemo?',
      options: ['Goldfish', 'Clownfish', 'Blue Tang', 'Pufferfish'],
      correctAnswer: 'Clownfish',
      icon: '🐠',
    },
    {
      text: 'Who is the villain in *The Dark Knight*?',
      options: ['Joker', 'Bane', 'Two-Face', 'Penguin'],
      correctAnswer: 'Joker',
      icon: '🃏',
    },
    {
      text: 'Which actor played Wolverine?',
      options: ['Ryan Reynolds', 'Chris Hemsworth', 'Hugh Jackman', 'Christian Bale'],
      correctAnswer: 'Hugh Jackman',
      icon: '🦸‍♂️',
    },
    {
      text: 'Which movie has the character "Forrest Gump"?',
      options: ['Cast Away', 'The Terminal', 'Forrest Gump', 'Green Mile'],
      correctAnswer: 'Forrest Gump',
      icon: '🏃‍♂️',
    },
    {
      text: 'Which film franchise includes the song “Let It Go”?',
      options: ['Frozen', 'Tangled', 'Coco', 'Encanto'],
      correctAnswer: 'Frozen',
      icon: '❄️',
    },
    {
      text: 'What kind of creature is Shrek?',
      options: ['Goblin', 'Troll', 'Ogre', 'Giant'],
      correctAnswer: 'Ogre',
      icon: '🧌',
    },
    {
      text: 'Which movie is about a boy who befriends an alien?',
      options: ['Star Wars', 'E.T.', 'The Goonies', 'Close Encounters'],
      correctAnswer: 'E.T.',
      icon: '👽',
    },
    {
      text: 'What is the name of the cowboy in *Toy Story*?',
      options: ['Buzz', 'Jessie', 'Woody', 'Andy'],
      correctAnswer: 'Woody',
      icon: '🤠',
    },
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
        Movies Quiz
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
