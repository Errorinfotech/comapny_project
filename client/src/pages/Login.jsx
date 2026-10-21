import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SmokeyBackground, LoginForm } from '../components/ui/login-form';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(username.trim(), password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'client') {
                navigate('/client-portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Server સાથે કનેક્ટ નથી થઈ શકતું (Network Error).' : 'Invalid username or password.');
            setError(msg);
        } finally {
            setLoading(false);
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
                    loading={loading}
                    onSubmit={handleSubmit}
                />
            </div>
        </main>
    );
};

export default Login;
