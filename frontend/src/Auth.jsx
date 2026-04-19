import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch('http://127.0.0.1:8000/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });

        if (!res.ok) throw new Error('Invalid credentials');
        
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);
        navigate('/dashboard');
      } else {
        const res = await fetch('http://127.0.0.1:8000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) throw new Error('Failed to register');
        
        // Auto login after test
        setIsLogin(true);
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 2rem', maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '3rem 2.5rem', border: '1px solid var(--gray-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>
            {isLogin ? 'Login' : 'Signup'} <span style={{fontWeight: '400', fontSize: '1rem', color: 'var(--text-medium)'}}>or</span> {isLogin ? 'Signup' : 'Login'}
          </h2>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Name"
                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--gray-border)', borderRadius: '0', outline: 'none' }}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--gray-border)', borderRadius: '0', outline: 'none' }}
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--gray-border)', borderRadius: '0', outline: 'none' }}
              required
            />
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-medium)', margin: '1rem 0' }}>
            By continuing, I agree to the <span style={{color: 'var(--accent)', fontWeight: '700', cursor: 'pointer'}}>Terms of Use</span> & <span style={{color: 'var(--accent)', fontWeight: '700', cursor: 'pointer'}}>Privacy Policy</span>
          </p>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', background: '#ff3f6c', fontSize: '0.9rem' }}>
            CONTINUE
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
          {isLogin ? "New to Myntra? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: '700' }}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}
