import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingScreen() {
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [usernameVisible, setUsernameVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);

  useEffect(() => {
    const loadName = async () => {
      const savedName = await AsyncStorage.getItem('username');
      if (savedName) {
        setName(savedName);
        setNewName(savedName);
      }
    };
    loadName();
  }, []);

  const saveName = async () => {
    await AsyncStorage.setItem('username', newName);
    setName(newName);
    alert('✅ Name updated!');
  };

  const toggleUsernameSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setUsernameVisible(!usernameVisible);
  };

  const toggleAboutSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAboutVisible(!aboutVisible);
  };

  const toggleRatingSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRatingVisible(!ratingVisible);
  };

  const openFeedbackEmail = () => {
    const subject = encodeURIComponent('📝 Feedback on MemeMaster App');
    const body = encodeURIComponent('Hi Roshan,\n\nHere is my feedback: \n\n');
    const email = `mailto:chhetrirosun@gmail.com?subject=${subject}&body=${body}`;
    Linking.openURL(email).catch(() => {
      Alert.alert('Error', 'Could not open the email app.');
    });
  };

  const sendStarRatingFeedback = () => {
    const subject = encodeURIComponent('⭐ Rating Feedback - MemeMaster App');
    const body = encodeURIComponent(
      `Hi Roshan,\n\nI rated the app ${selectedStars} out of 5 stars.\n\nHere is my feedback:\n\n`
    );
    const email = `mailto:chhetrirosun@gmail.com?subject=${subject}&body=${body}`;
    Linking.openURL(email).catch(() => {
      Alert.alert('Error', 'Could not open the email app.');
    });
  };

  const renderStars = () => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setSelectedStars(star)}>
            <Text style={[styles.star, selectedStars >= star && styles.starSelected]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>⚙️ Settings</Text>

        {/* Username Section */}
        <View style={styles.aboutBox}>
          <TouchableOpacity onPress={toggleUsernameSection}>
            <Text style={styles.aboutTitle}>
              👤 Change Username {usernameVisible ? '🔼' : '🔽'}
            </Text>
          </TouchableOpacity>

          {usernameVisible && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>Current Name:</Text>
              <Text style={styles.currentName}>{name || 'No name set yet'}</Text>

              <Text style={styles.label}>Enter New Name:</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your name"
                style={styles.input}
              />

              <View style={styles.buttonContainer}>
                <Button title="Save Name" onPress={saveName} color="#4caf50" />
              </View>
            </View>
          )}
        </View>

        {/* About Section */}
        <View style={styles.aboutBox}>
          <TouchableOpacity onPress={toggleAboutSection}>
            <Text style={styles.aboutTitle}>
              📱 About This App {aboutVisible ? '🔼' : '🔽'}
            </Text>
          </TouchableOpacity>

          {aboutVisible && (
            <View style={styles.aboutContent}>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>🧠 App Name:</Text>
                <Text style={styles.aboutValue}>Quiz App</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>🆚 Version:</Text>
                <Text style={styles.aboutValue}>1.0.0</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>👨‍💻 Developer:</Text>
                <Text style={styles.aboutValue}>Roshan Adhikari</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>📧 Contact:</Text>
                <Text style={styles.aboutValue}>chhetrirosun@gmail.com</Text>
              </View>

              <View style={styles.linkButtons}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() =>
                    Linking.openURL('https://roshanadhikari25.com.np/privacy-policy')
                  }
                >
                  <Text style={styles.linkButtonText}>📜 Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: '#ff9800' }]}
                  onPress={openFeedbackEmail}
                >
                  <Text style={styles.linkButtonText}>✉️ Send Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Rate This App Section */}
        <View style={styles.aboutBox}>
          <TouchableOpacity onPress={toggleRatingSection}>
            <Text style={styles.aboutTitle}>
              ⭐ Rate This App {ratingVisible ? '🔼' : '🔽'}
            </Text>
          </TouchableOpacity>

          {ratingVisible && (
            <View style={{ marginTop: 15 }}>
              {renderStars()}
              <TouchableOpacity
                style={[styles.linkButton, { marginTop: 15 }]}
                onPress={sendStarRatingFeedback}
              >
                <Text style={styles.linkButtonText}>✉️ Submit Rating</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  aboutBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4caf50',
    textAlign: 'center',
  },
  aboutContent: {
    marginTop: 15,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  aboutLabel: {
    fontSize: 16,
    color: '#555',
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  linkButtons: {
    marginTop: 20,
    gap: 10,
  },
  linkButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  currentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4caf50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  star: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  starSelected: {
    color: '#ffb300',
  },
});
