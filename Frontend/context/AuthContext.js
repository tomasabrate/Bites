import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import firebaseApp from '../firebase_config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
            if (userCredential) {
                setUser({
                    uid: userCredential.uid,
                    email: userCredential.email,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const logout = () => {
        signOut(auth)
            .then(() => setUser(null))
            .catch(error => console.log(error));
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
