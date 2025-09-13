import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

// Calculate card size for 2 cards in a row
const { width } = Dimensions.get("window");
const cardSize = (width - 60) / 2;

const categories = [
  { icon: "💻", title: "Technology" },
  { icon: "🏅", title: "Sport" },
  { icon: "📚", title: "History" },
  { icon: "🧩", title: "Mixed" },
  { icon: "🎵", title: "Music" },
  { icon: "🌍", title: "Geography" },
  { icon: "🎬", title: "Movies" },
  { icon: "🧬", title: "Science" },
];

export default function QuizScreen({ navigation }) {
  const handleCategoryPress = (category) => {
    navigation.navigate(category);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>🧠 Quiz Time!</Text>
      <Text style={styles.subText}>Pick a category to begin 👇</Text>
      <View style={styles.categoryWrapper}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item.title)}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#f6f9fc",
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3b3b98",
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  subText: {
    fontSize: 18,
    color: "#636e72",
    marginBottom: 20,
  },
  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: cardSize,
    height: cardSize,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3436",
  },
});
