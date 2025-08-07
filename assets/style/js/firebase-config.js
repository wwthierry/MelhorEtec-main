// Verifica se o Firebase já foi inicializado
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK não carregado!');
} else if (!firebase.apps.length) {
  const firebaseConfig = {
      apiKey: "AIzaSyDHGcI5_dgxWw2veczegnpwjxkthy4E5uk",
      authDomain: "login-761d0.firebaseapp.com",
      projectId: "login-761d0",
      storageBucket: "login-761d0.firebasestorage.app",
      messagingSenderId: "520862187962",
      appId: "1:520862187962:web:7c6db834620f24a69c9d83"
  };
  
  // Inicializa o Firebase
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase inicializado com sucesso!');
}