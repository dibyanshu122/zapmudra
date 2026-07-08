/* =====================================================================
   ZAP MUDRA — Firebase project configuration
   ---------------------------------------------------------------------
   Replace the placeholder values below with YOUR Firebase project's web
   config. Find it at: Firebase Console > Project settings > General >
   "Your apps" > SDK setup and configuration.

   Also make sure, in Firebase Console > Authentication > Sign-in method,
   that "Email/Password" and "Google" providers are both enabled.
   ===================================================================== */

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
