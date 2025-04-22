import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from './firebase';
import './App.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch('http://localhost:5000/api/auth/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google auth failed');

      localStorage.setItem('role', data.role);
      localStorage.setItem('user', JSON.stringify(data));

      alert('Google Sign-in successful!');
      navigate(data.role === 'admin' ? '/admin-dashboard' : '/dashboard');

    } catch (err) {
      console.error('❌ Google sign-in failed:', err);
      alert(err.message || 'Google sign-in failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters and contain both letters and numbers');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role);
      localStorage.setItem('user', JSON.stringify(result));

      alert(isSignup ? 'Signup successful!' : 'Login successful!');
      navigate(result.role === 'admin' ? '/admin-dashboard' : '/dashboard');

    } catch (err) {
      console.error('❌ Error:', err);
      alert(err.message || 'Login request failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? 'Create an Account' : 'Welcome Back'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <hr />

        <button className="google-btn" onClick={handleGoogleSignIn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          {isSignup ? 'Sign Up with Google' : 'Log In with Google'}
        </button>

        <p style={{ marginTop: '20px' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span
            style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
