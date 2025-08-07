// Verifica se o Firebase está carregado
if (typeof firebase === 'undefined') {
    console.error('Firebase não foi carregado corretamente!');
    alert('Erro no sistema. Por favor, recarregue a página.');
  } else {
    // Monitora o estado de autenticação
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Usuário autenticado:', user.email);
        redirectToMenu();
      } else {
        console.log('Nenhum usuário autenticado');
        setupLoginForm();
      }
    });
  }
  
  function redirectToMenu() {
    console.log('Tentando redirecionar para menu.html');
    
    // Tenta vários métodos de redirecionamento
    try {
      // Método 1: Caminho absoluto
      const absolutePath = window.location.origin + '/menu.html';
      console.log('Tentando com caminho absoluto:', absolutePath);
      window.location.assign(absolutePath);
      
      // Se não redirecionar em 2 segundos, tenta outro método
      setTimeout(() => {
        // Método 2: Caminho relativo
        const relativePath = '../menu.html'; // Ajuste conforme sua estrutura
        console.log('Tentando com caminho relativo:', relativePath);
        window.location.href = relativePath;
      }, 2000);
    } catch (error) {
      console.error('Erro no redirecionamento:', error);
      alert('Erro ao redirecionar. Por favor, acesse menu.html manualmente.');
    }
  }
  
  function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
  
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const rm = document.getElementById('rm').value.trim();
      const senha = document.getElementById('senha').value;
      const remember = document.getElementById('remember')?.checked;
  
      try {
        // Validação básica
        if (!rm || !senha) {
          alert('Por favor, preencha todos os campos!');
          return;
        }
  
        console.log('Tentando login com RM:', rm);
        
        // Configura persistência
        await firebase.auth().setPersistence(
          remember ? firebase.auth.Auth.Persistence.LOCAL 
                  : firebase.auth.Auth.Persistence.SESSION
        );
        
        // Faz login
        await firebase.auth().signInWithEmailAndPassword(
          `${rm}@escola.com`,
          senha
        );
        
        // O redirecionamento será tratado por onAuthStateChanged
        
      } catch (error) {
        console.error('Erro no login:', error);
        handleLoginError(error);
      }
    });
  
    // Configura o toggle de senha
    document.getElementById('togglePassword')?.addEventListener('click', function() {
      const senhaInput = document.getElementById('senha');
      if (senhaInput) {
        senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
      }
    });
  }
  
  function handleLoginError(error) {
    let message = 'Erro no login. Tente novamente.';
    
    switch(error.code) {
      case 'auth/user-not-found':
        message = 'RM não cadastrado!';
        break;
      case 'auth/wrong-password':
        message = 'Senha incorreta!';
        break;
      case 'auth/invalid-email':
        message = 'Formato de RM inválido!';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas. Tente mais tarde.';
        break;
    }
    
    alert(message);
  }