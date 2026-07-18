import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function Register() {
  const navigate = useNavigate();

  const handleSuccess = (participant) => {
    navigate('/success', { state: { participant } });
  };

  return (
    <div className="page register-page">
      <div className="container">
        <RegistrationForm onSuccess={handleSuccess} />
      </div>

      <style>{`
        .register-page {
          background:
            radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
            var(--color-bg);
          padding: 2.5rem 0 3rem;
        }
      `}</style>
    </div>
  );
}