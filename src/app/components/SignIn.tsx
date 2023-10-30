// src/app/SignIn.tsx
"use client";
import { useState } from 'react';
import { signInWithPopup, auth, GoogleAuthProvider, signInWithEmailAndPassword } from '@/lib/firebase/firebase';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleRegularSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage('Login successful!');
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage(`Login failed: ${(error as Error).message}`);
        }
    };



    return (
        <div>
            <button onClick={handleGoogleSignIn}>Sign In with Google</button>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegularSignIn}>Sign In</button>
            </div>
            {message && <div>{message}</div>}
        </div>
    );
};

export default SignIn;
