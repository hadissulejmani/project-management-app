import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvBBNaEUS6sLUd8ZIukXBpWDAnFDwhoQs",
  authDomain: "project-management-site-22537.firebaseapp.com",
  projectId: "project-management-site-22537",
  storageBucket: "project-management-site-22537.appspot.com",
  messagingSenderId: "1082396903961",
  appId: "1:1082396903961:web:17f0b5264acd39ae8cb888",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const timestamp = db.timestamp;

export { app, db, auth, timestamp };
