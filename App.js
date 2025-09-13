import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ updated

// Screens
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import SettingScreen from './screens/SettingScreen';
import IntroScreen from './screens/IntroScreen';
import SportScreen from './CategoryScreen/SportScreen';
import HistoryScreen from './CategoryScreen/HistoryScreen';
import TechnologyScreen from './CategoryScreen/TechnologyScreen';
import MixedScreen from './CategoryScreen/MixedScreen';
import ScienceScreen from './CategoryScreen/ScienceScreen';
import GeographyScreen from './CategoryScreen/GeographyScreen';
import MoviesScreen from './CategoryScreen/MoviesScreen';
import MusicScreen from './CategoryScreen/MusicScreen';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function QuizStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizMain" component={QuizScreen} />
      <Stack.Screen name="Technology" component={TechnologyScreen} />
      <Stack.Screen name="Sport" component={SportScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Mixed" component={MixedScreen} />
      <Stack.Screen name="Science" component={ScienceScreen} />
      <Stack.Screen name="Music" component={MusicScreen} />
      <Stack.Screen name="Movies" component={MoviesScreen} />
      <Stack.Screen name="Geography" component={GeographyScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Quiz') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          }  
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4caf50',
        tabBarInactiveTintColor: 'grey',
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Quiz" component={QuizStack} />
      <Tabs.Screen name="Setting" component={SettingScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
