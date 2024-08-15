import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from "@expo/vector-icons/AntDesign";
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
import ReservationData from './views/ReservationData/ReservationData';
import History from "./views/History/history"
import { COLORS } from './utils/constants';
import ReservationConfirmation from './views/Reservation/ReservationConfirmation/ReservationConfirmation';
import ReservationTime from './views/Reservation/ReservationTime/ReservationTime';
import ReservationPeople from './views/Reservation/ReservationPeople/ReservationPeople';
import ReservationDate from './views/Reservation/ReservationDate/ReservationDate';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NewReservationNavigation () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NewReservationPeople" component={ReservationPeople} options={{headerShown:false}} />
      <Stack.Screen name="NewReservationTime" component={ReservationTime} options={{headerShown:false}} />
      <Stack.Screen name="NewReservationDate" component={ReservationDate} options={{headerShown:false}} />
      <Stack.Screen name="NewReservationConfirmation" component={ReservationConfirmation} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}

function EditReservationNavigation () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EditReservationPeople" component={ReservationPeople} options={{headerShown:false}} />
      <Stack.Screen name="EditReservationTime" component={ReservationTime} options={{headerShown:false}} />
      <Stack.Screen name="EditReservationConfirmation" component={ReservationConfirmation} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}


function HomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue}}} />
      <Stack.Screen name="Restaurante" component={Restaurant} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue}}} />
      <Stack.Screen name="HomeReservation" component={ReservationData} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue},title:'Reserva'}} />
      <Stack.Screen name="EditReservation" component={EditReservationNavigation} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue},title:'Editar Reserva'}} />
      <Stack.Screen name="NewReservation" component={NewReservationNavigation} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue},title:'Nueva Reserva'}} />
    </Stack.Navigator>
  )
}

function HistoryNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={History} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue}}} />
      <Stack.Screen name="HistoryReservation" component={ReservationData} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue}}} />
      <Stack.Screen name="EditReservation" component={EditReservationNavigation} options={{headerTitleStyle:{color:COLORS.white},headerStyle:{backgroundColor:COLORS.blue},title:'Editar Reserva'}} />
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
                return <AntDesign name="user" size={size} color={color} />
                break;
              case 'HistorialNavigation':
                iconName = 'list'
                break;
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.yellow,
          tabBarInactiveTintColor: COLORS.gray,
          tabBarActiveBackgroundColor:COLORS.blue,
          tabBarInactiveBackgroundColor:COLORS.blue,
        })}
        >
          <Tab.Screen name="HomeNavigation" component={HomeNavigation} options={{ headerShown: false, title:'Home' }} />
          <Tab.Screen name="HistorialNavigation" component={HistoryNavigation} options={{ headerShown: false, title:'Historial'}} />
          {/* <Tab.Screen name="MapaNavigation" component={Settings} options={{ headerShown: false, title:'Mapa' }} /> */}
          {/* <Tab.Screen name="ExplorarNavigation" component={Settings} options={{ headerShown: false, title:'Explorar' }} /> */}
          {/* <Tab.Screen name="RestósNavigation" component={Settings} options={{ headerShown: false, title:'Restós' }} /> */}
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

