import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffeae6' }}>
      <Text>Casa!</Text>
      <Pressable 
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#ff8566' : '#ff6347',
          }
        ]}
        onPress={() => navigation.navigate('Productos')}
      >
        <Text >Ir a Productos</Text>
      </Pressable>
    </View>
  );
}
