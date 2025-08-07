console.log('criar.js carregado');

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Formulário de cadastro enviado');

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Validações básicas
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Por favor, insira um e-mail válido!');
        return;
    }

    try {
        console.log('Iniciando cadastro...');
        
        // 1. Criação do usuário no Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(
            email,
            senha
        );
        
        console.log('Usuário criado no Auth com UID:', userCredential.user.uid);

        // 2. Salvando dados adicionais no Firestore
        if (firebase.firestore && userCredential.user) {
            try {
                await firebase.firestore().collection('usuarios')
                    .doc(userCredential.user.uid)
                    .set({
                        nome: nome,
                        email: email,
                        criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
                        tipo: 'aluno'
                    }, { merge: true });
                
                console.log('Dados adicionais salvos no Firestore');
            } catch (firestoreError) {
                console.error("Erro ao salvar no Firestore:", firestoreError);
                alert('Conta criada, mas houve um problema ao salvar informações adicionais.');
            }
        }

        alert('Cadastro realizado com sucesso! Redirecionando...');
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Erro no processo de cadastro:', error.code, error.message);
        
        if (error.code === 'auth/email-already-in-use') {
            const resposta = confirm('E-mail já cadastrado! Deseja ir para a página de login?');
            if (resposta) window.location.href = 'login.html';
        } 
        else if (error.code === 'auth/invalid-email') {
            alert('Formato de e-mail inválido!');
        }
        else if (error.code === 'auth/weak-password') {
            alert('A senha deve ter pelo menos 6 caracteres!');
        }
        else if (error.code === 'permission-denied') {
            alert('Erro de permissões. Estamos ajustando o sistema, tente novamente mais tarde.');
        }
        else {
            alert(`Erro inesperado: ${error.message}`);
        }
    }
});

document.getElementById('togglePassword')?.addEventListener('click', function() {
    const senhaInput = document.getElementById('confirmarSenha');
    if (senhaInput) {
        senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
    }
});