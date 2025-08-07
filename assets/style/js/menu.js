import './firebase-config.js';

auth.onAuthStateChanged((user) => {
  if (!user) {
    // Usuário não está autenticado, redirecionar para login
    window.location.href = 'login.html';
  } else {
    // Usuário autenticado, pode carregar a página
    console.log('Usuário logado:', user);
    // Aqui você pode buscar informações adicionais do Firestore se necessário
  }
});

// Botão de logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'login.html';
  });
});