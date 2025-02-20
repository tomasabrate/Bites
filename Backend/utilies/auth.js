import { getAuth } from 'firebase/auth';

const auth = getAuth();
const usuario = auth.currentUser;

if (usuario) {
    const uid_cliente = usuario.uid;
    console.log('UID Cliente:', uid_cliente);
} else {
    console.log('El usuario no está autenticado');
}

