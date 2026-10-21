import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SmokeyBackground, LoginForm } from '../components/ui/login-form';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(username, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <main className="relative w-screen h-screen bg-[#020617] overflow-hidden">
            {/* Shader Background */}
            <SmokeyBackground 
                className="absolute inset-0" 
                color="#0ea5e9" // Cyan-500 matching original theme
                backdropBlurAmount="lg"
            />
            
            <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                <LoginForm 
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    onSubmit={handleSubmit}
                />
            </div>
        </main>
    );
};

export default Login;
