import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { useEffect } from 'react';
import { GetUser } from './hooks/getUser.hook';

import Home from './views/home/home';
import Settings from './views/Settings/Settings';
import { LogInForm } from './views/login/login';
import { SignInForm } from './views/signIn/signIn';
import Profile from './views/Profile/Profile';
import Restaurant from './views/Restaurant/Restaurant';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Restaurante" component={Restaurant} />
    </Stack.Navigator>
  )
}

export default function App() {
  const {
    user,
    initializing,
  } = GetUser()

  useEffect(()=>{
    console.log(user,initializing)
  },[user,initializing])

  return (
    <Provider store={store}>
      <NavigationContainer>
        {(!initializing&&user!==null)&&<Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch(route.name) {
              case 'HomeNavigation':
                iconName = 'home'
                break;
              case 'MapaNavigation':
                iconName = 'map'
                break;
              case 'ExplorarNavigation':
                iconName = 'compass'
                break;
              case 'RestósNavigation':
                iconName = 'restaurant'
                break;
              case 'PerfilNavigation':
                iconName = 'list'
                break;
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        >
          <Tab.Screen name="HomeNavigation" component={HomeNavigation} options={{ headerShown: false, title:'Home' }} />
          <Tab.Screen name="MapaNavigation" component={Settings} options={{ headerShown: false, title:'Mapa' }} />
          <Tab.Screen name="ExplorarNavigation" component={Settings} options={{ headerShown: false, title:'Explorar' }} />
          <Tab.Screen name="RestósNavigation" component={Settings} options={{ headerShown: false, title:'Restós' }} />
          <Tab.Screen name="PerfilNavigation" component={Profile} options={{ headerShown: false, title:'Perfil'}} />
        </Tab.Navigator>}
        {!(!initializing&&user!==null)&&<Stack.Navigator>
          <Stack.Screen name="LogIn" component={LogInForm} />
          <Stack.Screen name="SignIn" component={SignInForm} />
        </Stack.Navigator>
        }
      </NavigationContainer>
    </Provider>
  );
}

