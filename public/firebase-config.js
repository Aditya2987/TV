// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZQngoT83Gws3duJ_LlYJx0Da34EHbpaY",
    authDomain: "tv-channels-f64ae.firebaseapp.com",
    databaseURL: "https://tv-channels-f64ae-default-rtdb.firebaseio.com",
    projectId: "tv-channels-f64ae",
    storageBucket: "tv-channels-f64ae.firebasestorage.app",
    messagingSenderId: "862503979734",
    appId: "1:862503979734:web:569b8912fa9703adeed777",
    measurementId: "G-Y879JKDVXY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
