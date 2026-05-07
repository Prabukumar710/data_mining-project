import React, { useState, useMemo } from 'react';

interface AuthPageProps {
    onLoginSuccess: () => void;
}

// --- SVG Icons for UI Elements ---
const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

// --- Password Strength Calculation ---
const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

// In a real app, this would be a secure, one-way hashing algorithm like bcrypt on the server.
// Here we use Base64 encoding to *simulate* the concept of not storing plaintext passwords.
const simpleHash = (text: string) => btoa(text);


const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

    const handleAuthAction = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLoginView) {
            // Login Logic
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.email === email && user.passwordHash === simpleHash(password)) {
                    localStorage.setItem('loggedInUser', JSON.stringify({ email }));
                    onLoginSuccess();
                } else {
                    setError('Invalid email or password.');
                }
            } else {
                setError('No user found. Please sign up.');
            }
        } else {
            // Sign Up Logic
            if (!email || !password || !confirmPassword) {
                setError('All fields are required.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (passwordStrength < 3) {
                setError('Password is too weak. Please include a mix of letters, numbers, and symbols.');
                return;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                setError('Please enter a valid email address.');
                return;
            }
            
            const newUser = { email, passwordHash: simpleHash(password) };
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('loggedInUser', JSON.stringify({ email }));
            onLoginSuccess();
        }
    };
    
    const getStrengthBarColor = (level: number) => {
        if (password.length === 0) return 'bg-gray-600';
        if (passwordStrength >= level) {
            if (passwordStrength < 3) return 'bg-red-500';
            if (passwordStrength < 4) return 'bg-yellow-500';
            return 'bg-green-500';
        }
        return 'bg-gray-600';
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
             <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Game Recommendation System
                    </span>
                </h1>
                <p className="mt-2 text-lg text-gray-400">Sign in to find your next adventure</p>
            </div>
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {isLoginView ? 'Login' : 'Sign Up'}
                </h2>
                <form onSubmit={handleAuthAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={isLoginView ? 'current-password' : 'new-password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            required
                        />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-400 hover:text-white">
                            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                     {!isLoginView && (
                        <div>
                            <div className="grid grid-cols-4 gap-2 h-2 rounded-full overflow-hidden">
                                <div className={`transition-colors duration-300 ${getStrengthBarColor(1)}`}></div>
                                <div className={`transition-colors duration-300 ${getStrengthBarColor(2)}`}></div>
                                <div className={`transition-colors duration-300 ${getStrengthBarColor(3)}`}></div>
                                <div className={`transition-colors duration-300 ${getStrengthBarColor(4)}`}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {password.length > 0 && ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][passwordStrength-1]}
                            </p>
                        </div>
                    )}
                    {!isLoginView && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-8 text-gray-400 hover:text-white">
                                {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                    )}
                     {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 disabled:bg-gray-500"
                        disabled={!isLoginView && passwordStrength < 3}
                    >
                        {isLoginView ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    {isLoginView ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        onClick={() => {
                            setIsLoginView(!isLoginView);
                            setError('');
                            setPassword('');
                            setConfirmPassword('');
                        }}
                        className="text-purple-400 hover:underline ml-2 font-semibold"
                    >
                        {isLoginView ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;