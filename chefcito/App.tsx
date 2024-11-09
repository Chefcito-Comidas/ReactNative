import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { useEffect } from 'react';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Navigation } from './Navigation';

export default function App() {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "170744366068-hrdaou9sieacr0eg5fui2c23npa2berf.apps.googleusercontent.com",
      offlineAccess:true
    });
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

