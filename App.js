import * as React from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import PersonagemDetalhesScreen from './screens/PersonagemDetalhesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CombinedDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: '#121212',
    card: '#1c1c1e',
    text: '#fff',
    primary: '#bb86fc',
    border: '#222222',
    notification: '#bb86fc',
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Favoritos') iconName = 'favorite';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: CombinedDarkTheme.colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: CombinedDarkTheme.colors.card,
          borderTopColor: CombinedDarkTheme.colors.border,
        },
        headerStyle: {
          backgroundColor: CombinedDarkTheme.colors.card,
        },
        headerTintColor: CombinedDarkTheme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Animes' }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={PaperDefaultTheme}>
      <NavigationContainer theme={CombinedDarkTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: CombinedDarkTheme.colors.card },
            headerTintColor: CombinedDarkTheme.colors.text,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ title: 'Detalhes do Anime' }}
          />
          <Stack.Screen
            name="PersonagemDetalhes"
            component={PersonagemDetalhesScreen}
            options={{ title: 'Detalhes do Personagem' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
