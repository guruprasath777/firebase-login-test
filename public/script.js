// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAb6APNS8WTXS6FTf3WXIOROMOycZ6yYbE",
  authDomain: "login-form-52cc7.firebaseapp.com",
  projectId: "login-form-52cc7",
  storageBucket: "login-form-52cc7.appspot.com",
  messagingSenderId: "616137758549",
  appId: "1:616137758549:web:da0ab41181e5cfb20e41dc",
  measurementId: "G-6LMR08LZ9E"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

// Login handler
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      // Save to Firestore
      db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Update UI
      userInfo.innerHTML = `
        <h3>Welcome, ${user.displayName}</h3>
        <p>Email: ${user.email}</p>
        <img src="${user.photoURL}" width="100" />
      `;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline";
    })
    .catch((error) => {
      console.error("Login Error:", error);
    });
});

// Logout handler
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    userInfo.innerHTML = "";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  });
});

// Auto-login check
auth.onAuthStateChanged((user) => {
  if (user) {
    userInfo.innerHTML = `
      <h3>Welcome back, ${user.displayName}</h3>
      <p>Email: ${user.email}</p>
      <img src="${user.photoURL}" width="100" />
    `;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  }
});
