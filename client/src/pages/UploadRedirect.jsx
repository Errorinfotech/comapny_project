import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate to dashboard and signal to open upload modal
        navigate('/dashboard', { state: { openUpload: true } });
    }, [navigate]);

    return null;
};

export default UploadRedirect;
