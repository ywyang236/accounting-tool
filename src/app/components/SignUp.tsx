// src/app/SignUp.tsx
"use client";
import { useState } from 'react';
import { createUserWithEmailAndPassword, auth } from '@/lib/firebase/firebase';

const SignUp = () => {
    const [message, setMessage] = useState<string | null>(null);

    const handleSignUp = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage('Registration successful!');
        } catch (error) {
            console.error('Error signing up:', error);
            setMessage(`Registration failed: ${(error as Error).message}`);
        }
    };

    const handleSignUpClick = () => {
        const emailInput = document.getElementById('signupEmail') as HTMLInputElement;
        const passwordInput = document.getElementById('signupPassword') as HTMLInputElement;

        if (emailInput && passwordInput) {
            if (emailInput.value && passwordInput.value) {
                handleSignUp(emailInput.value, passwordInput.value);
            } else {
                setMessage('Please fill in both email and password.');
            }
        }
    };

    return (
        <div>
            <input type="email" placeholder="Email" id="signupEmail" />
            <input type="password" placeholder="Password" id="signupPassword" />
            <button onClick={handleSignUpClick}>Sign Up</button>
            {message && <div>{message}</div>}
        </div>
    );
};

export default SignUp;
