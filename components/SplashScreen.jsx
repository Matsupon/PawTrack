import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background color */}
      <View style={styles.background} />
      
      {/* Decorative circles */}
      <View style={styles.circlesContainer}>
        <LinearGradient
          colors={['rgba(255, 200, 175, 0.7)', 'rgba(255, 177, 140, 0)']}
          style={styles.circleTopLeft}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
        />
        <LinearGradient
          colors={['rgba(255, 200, 175, 0.7)', 'rgba(255, 177, 140, 0)']}
          style={styles.circleTopRight}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
        />
        <LinearGradient
          colors={['rgba(255, 200, 175, 0.7)', 'rgba(255, 177, 140, 0)']}
          style={styles.circleBottomLeft}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
        />
      </View>
      
      {/* Logo and content */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>PawTrack</Text>
        
        <Text style={styles.subtitle}>
          Pet Adoption Manager
        </Text>
      </Animated.View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFB18C', // Salmon color from the design
    zIndex: 1,
  },
  circlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  circleTopLeft: {
    position: 'absolute',
    width: 383,
    height: 383,
    top: -68,
    left: -50,
    borderRadius: 191.5,
  },
  circleTopRight: {
    position: 'absolute',
    width: 383,
    height: 383,
    top: 151,
    left: 145,
    borderRadius: 191.5,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 383,
    height: 383,
    top: 534,
    left: -76,
    borderRadius: 191.5,
  },
  contentContainer: {
    alignItems: 'center',
    zIndex: 3,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 93,
    height: 67,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 10,
    textShadowColor: 'rgba(61, 53, 107, 0.13)',
    textShadowOffset: { width: 0, height: 12 },
    textShadowRadius: 9,
  },
  subtitle: {
    fontSize: 18,
    color: '#3F3E3F',
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 20,
  },
  brandContainer: {
    position: 'absolute',
    top: '38%',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  brandIconContainer: {
    width: 20,
    height: 17,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SplashScreen;