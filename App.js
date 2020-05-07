import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { config, FACEBOOK_APP_ID } from './config/firebase';

Facebook.initializeAsync(`${config.appId}`, 'firebase-login-starter');
firebase.initializeApp(config);

const auth = firebase.auth();

export default function App() {
  const [loginStatus, setLoginStatus] = useState('Signed out');
  const [errorMessage, setErrorMessage] = useState('None');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user != null) {
        setLoginStatus('We are authenticated now');
      } else {
        setLoginStatus('You are currently logged out.');
      }
    });
  }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }

  const handleFacebookButton = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email'],
    });
    console.log(type, 'type');
    if (type === 'success') {
      //Firebase credential is created with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      auth.signInWithCredential(credential).catch((error) => {
        setErrorMessage(error.message);
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.facebookButton}
        name="Facebook"
        underlayColor={styles.facebookButton.backgroundColor}
        onPress={() => handleFacebookButton()}
      >
        <Text style={styles.facebookButtonText}>Log in with Facebook</Text>
      </TouchableHighlight>
      <View style={styles.space} />
      <Text>Logged In Status: {loginStatus}</Text>

      <View style={styles.space} />
      <Text> Log In Error Messages: {errorMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookButton: {
    width: 375 * 0.75,
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5998',
  },
  facebookButtonText: {
    color: '#fff',
  },
  space: {
    height: 17,
  },
});
