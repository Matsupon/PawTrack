import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { PetProvider } from './PetContext';
import SplashScreen from '../components/SplashScreen';
import { Animated, View, StyleSheet, Image } from 'react-native';

export default function AppLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => { 
    const timer = setTimeout(() => { 
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => { 
        setIsLoading(false);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <PetProvider>
      <View style={styles.rootContainer}>
        <Tabs 
          screenOptions={{ 
            headerShown: false,
            tabBarStyle: {
              height: 70,
              paddingBottom: 20,
              backgroundColor: '#fff',
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.03,
              shadowRadius: 50,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
            tabBarShowLabel: false,
            tabBarItemStyle: {
              padding: 0,
              marginTop: 15,
            },
            tabBarIconStyle: {
              marginBottom: 0,
            },
            tabBarActiveTintColor: '#FFB08C',
            tabBarInactiveTintColor: '#C4C4C4',
          }}
        >
          <Tabs.Screen
            name="(tabs)/pets"
            options={{
              tabBarIcon: ({ color }) => (
                <FontAwesome name="paw" size={30} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="(tabs)/index"
            options={{
              tabBarIcon: ({ color }) => (
                <FontAwesome name="home" size={30} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="(tabs)/adoptions"
            options={{
              tabBarIcon: ({ color }) => (
                <Image 
                  source={require('../assets/images/adoptions.png')}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: color
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </PetProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#fff',
  }
});