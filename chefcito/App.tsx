import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Home from './views/home/home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import Settings from './views/Settings/Settings';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
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
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
