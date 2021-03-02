import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useMemo} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Parse from 'parse/react-native'
import AsyncStorage from '@react-native-community/async-storage'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { PARSE_KEYS } from './constants/Parse-Keys';
import {useFonts, Oswald_400Regular} from '@expo-google-fonts/oswald'
import {Prata_400Regular} from '@expo-google-fonts/prata'

//Initializes Parse Server
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(PARSE_KEYS.applicationId, PARSE_KEYS.javascriptKey)
//@ts-ignore
Parse.serverURL=PARSE_KEYS.serverURL 

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({Oswald_400Regular, Prata_400Regular})

  if (!isLoadingComplete || !fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
