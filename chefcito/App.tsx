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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
              case 'Home':
                iconName = 'home'
                break;
              case 'Mapa':
                iconName = 'map'
                break;
              case 'Explorar':
                iconName = 'compass'
                break;
              case 'Restós':
                iconName = 'restaurant'
                break;
              case 'Perfil':
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
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Mapa" component={Settings} />
          <Tab.Screen name="Explorar" component={Settings} />
          <Tab.Screen name="Restós" component={Settings} />
          <Tab.Screen name="Perfil" component={Settings} />
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

