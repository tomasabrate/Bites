import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const EstrellaRating = ({ rating, totalReviews }) => {
  const [colorCuadro, setColorCuadro] = useState('');
  const [colorNumero, setColorNumero] = useState('');

  useEffect(() => {
    const getBackgroundColor = (rating) => {
      if (rating >= 3.5) {
        setColorCuadro('#cce891');
        setColorNumero('#739d19');
      } else if (rating >= 2.5) {
        setColorCuadro('#fff27d');
        setColorNumero('#c7b300');
      } else {
        setColorCuadro('#ff9b9b');
        setColorNumero('#d40c0c');
      }
    };

    getBackgroundColor(rating);
  }, [rating]);

  return (
    <View style={styles.container}>
      <View style={[styles.container1 ,{ backgroundColor: colorCuadro }]}>
          <FontAwesome name="star" size={16} color={colorNumero} />
          <Text style={[styles.ratingText, { color: colorNumero }]}>{rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.reviewCount}>({totalReviews})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 6,
    color: "#000",
  },
});

export default EstrellaRating