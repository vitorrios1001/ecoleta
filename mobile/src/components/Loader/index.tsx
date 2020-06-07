import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../constants';

interface LoaderProps {
  size?: number;
  title?: string;
  color?: string;
  rest?: any; 
}

const Loader: React.FC<LoaderProps> = ({
  size = 64,
  title = '',
  color = COLORS.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    maxWidth: 240,
    textAlign: 'center',
    marginTop: 32,
    fontFamily: 'Roboto_400Regular',
  },
})