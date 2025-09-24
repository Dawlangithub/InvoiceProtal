// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBTgTJz65SpckZTpVBNqIu8X247LoVQg8g",
    authDomain: "esync-a756b.firebaseapp.com",
    projectId: "esync-a756b",
    storageBucket: "esync-a756b.firebasestorage.app",
    messagingSenderId: "704124938070",
    appId: "1:704124938070:web:8b2c510ad6fab8c19bd8f7",
    measurementId: "G-WQXK4WXE9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

// project-704124938070

export { provider, app };