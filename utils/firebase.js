import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

async function saveUserCredentials(uid, name, email) {
  try {
    console.log("Saving user credentials to Firestore");
    
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      emailVerified: false
    });

    await setDoc(doc(db, "users", uid), userDoc);
    console.log("User credentials saved successfully");
  } catch (error) {
    console.error("Error saving user credentials:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
}

export async function createUser(email, password, name) {
  try {
    console.log("Creating user for:", name);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User created successfully:", user.name);

    // Update user profile with name
    await updateProfile(user, {
      displayName: name
    });
    
    console.log("User profile updated with name");
    
    // Send email verification
    await sendEmailVerification(user);
    console.log("Email verification sent");
    
    // Save additional user data to Firestore
    await saveUserCredentials(user.uid, name, email);
    
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function setAuthPersistence(rememberMe) {
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  try {
    console.log("Setting auth persistence:", rememberMe ? "local" : "session");
    await setPersistence(auth, persistence);
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
}

// Update user's last login (non-blocking)
async function updateLastLogin(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    console.log("Updating last login for user:", userDoc.data().name);
    await updateDoc(doc(db, "users", uid), {
      lastLogin: serverTimestamp(),
      emailVerified: auth.currentUser?.emailVerified || false
    });
    console.log("Last login updated successfully");
  } catch (error) {
    console.error("Error updating last login:", error);
    console.error("Firestore error details:", {
      code: error.code,
      message: error.message,
      projectId: firebaseConfig.projectId
    });
    
    // Check if Firestore is properly initialized
    if (error.code === 'failed-precondition') {
      console.error("Firestore database might not be initialized in Firebase Console");
    } else if (error.code === 'permission-denied') {
      console.error("Firestore security rules might be blocking this operation");
    }
  }
}

export async function loginInUser(email, password, rememberMe) {
  try {
    console.log("Logging in user with email:", email);

    // Set auth persistence before signing in
    await setAuthPersistence(rememberMe);

    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User logged in successfully:", user.name);

    // Update last login time in Firestore (non-blocking)
    updateLastLogin(user.uid).catch(err => {
      console.error("Error updating last login:", err);
    });

    return user;
  } catch (error) {
    console.error("Error signing in user:", error);
    throw error;
  }
}

export async function sendPasswordReset(email) {
  try {
    console.log("Sending password reset email to:", email);
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}