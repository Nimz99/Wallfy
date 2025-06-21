// Firebase configuration
// Replace this with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDCpogoRNO7wahqJl0hyS05WJONfB9Vlo8",
  authDomain: "wallfy-wallpapers.firebaseapp.com",
  projectId: "wallfy-wallpapers",
  storageBucket: "wallfy-wallpapers.firebasestorage.app",
  messagingSenderId: "86863885914",
  appId: "1:86863885914:web:2b765a14aa75827d324a63"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore(); 