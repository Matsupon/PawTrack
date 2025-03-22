import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native';

export default function TabsLayout() {
  return (
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
        name="pets"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="paw" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={30} color={color} />
          ),
        }}
      />
      
      
      <Tabs.Screen
        name="adoptions"
        options={{
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/adoptions.png')}
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
  );
} 