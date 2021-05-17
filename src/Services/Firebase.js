import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCpObpkiIjCiUjeEzauKDKGh2pt24yprX0',
  authDomain: 'fine-mart-supermarket.firebaseapp.com',
  databaseURL: 'https://fine-mart-supermarket.firebaseio.com',
  projectId: 'fine-mart-supermarket',
  storageBucket: 'fine-mart-supermarket.appspot.com',
  messagingSenderId: '1069993889095',
  appId: '1:1069993889095:web:6e19e377939325abab1062',
  measurementId: 'G-MSKLM3793J',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
