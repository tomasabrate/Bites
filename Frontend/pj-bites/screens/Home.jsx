import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffeae6' }}>
      <Text>Home!</Text>
      <Pressable
        style={({ pressed }) => [
          {
            borderRadius: 5,
            padding:10,
            backgroundColor: pressed ? '#ff8566' : '#ff6347',
          }
        ]}
        onPress={() => navigation.navigate('Productos')}
      >
        <Text>Promociones del dia!</Text>
      </Pressable>
    </View>
  );
}
