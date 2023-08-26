import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAApqsQqJ65f2oQM3q9ucspO-jlgsHCxNA",
    authDomain: "social-46883.firebaseapp.com",
    projectId: "social-46883",
    storageBucket: "social-46883.appspot.com",
    messagingSenderId: "872295146791",
    appId: "1:872295146791:web:dc970e567e5d1ecaa23502",
    measurementId: "G-NT64YLXP03"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;