'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { RiRobot3Fill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

// A more subtle spinner
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

 function FormInput({ id, name, type, placeholder, icon, label, required = false, value, onChange, onBlur, isValid, isTouched }: { id: string, name: string, type: string, placeholder: string, icon: React.ReactNode, label: string, required?: boolean, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onBlur: (e: React.FocusEvent<HTMLInputElement>) => void, isValid: boolean, isTouched: boolean }) {
  const ringColor = isTouched ? (isValid ? 'focus:ring-green-400' : 'focus:ring-red-400') : 'focus:ring-gray-300';
  const borderColor = isTouched ? (isValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300';


  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 ${ringColor} ${borderColor} transition-all`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

//styled FormButton
function FormButton({ loading, text }: { loading: boolean, text: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? <Spinner /> : <span className="tracking-wider">{text}</span>}
    </button>
  );
}

// Shared logic for forms
function AuthForm({ isSignup, onSubmit, loading }: { isSignup: boolean, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, loading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const validateEmail = (email: string) => {
    // A simple regex for email validation
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordValid(e.target.value.length >= 8);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordValid(e.target.value === password);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <FormInput 
        id={isSignup ? "signup-email" : "email"} 
        name="email" 
        type="email" 
        placeholder="example@gmail.com" 
        icon={<FaEnvelope />} 
        label="Enter your Email" 
        required 
        value={email}
        onChange={handleEmailChange}
        onBlur={() => setEmailTouched(true)}
        isValid={emailValid}
        isTouched={emailTouched}
      />
      <FormInput 
        id={isSignup ? "signup-password" : "password"} 
        name="password" 
        type="password" 
        placeholder="••••••••" 
        icon={<FaLock />} 
        label="Enter your Password" 
        required
        value={password}
        onChange={handlePasswordChange}
        onBlur={() => setPasswordTouched(true)}
        isValid={passwordValid}
        isTouched={passwordTouched}
      />
      {isSignup && (
        <FormInput 
          id="confirm-password" 
          name="confirm-password" 
          type="password" 
          placeholder="••••••••" 
          icon={<FaLock />} 
          label="Confirm your password" 
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={() => setConfirmPasswordTouched(true)}
          isValid={confirmPasswordValid}
          isTouched={confirmPasswordTouched}
        />
      )}
      <FormButton loading={loading} text={isSignup ? "Create an account" : "Log In"} />
    </form>
  );
}


export default function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const email = formData.get('email'); // Get email from form

    if (showSignup) {
      const confirmPassword = formData.get('confirm-password');
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }

    const action = showSignup ? signup : login;
    
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
    } else if (showSignup && result && 'success' in result && result.success) {
      setSuccessMessage(`Success! Please check your email at ${email} and click the confirmation link to activate your account.`);
    }

    setLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}>
      <div className="w-full max-w-md">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <RiRobot3Fill className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              {showSignup ? 'Create Your Account' : 'Welcome to Gemini'}
            </h1>
            <p className="mt-2 text-gray-500">
              {showSignup ? 'Your ideas start here. Sign in to power them up' : 'Back again? Let’s create something brilliant.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={showSignup ? 'signup' : 'login'}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AuthForm isSignup={showSignup} onSubmit={handleSubmit} loading={loading} />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              className="mt-4 text-center text-sm text-red-500 bg-red-100 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              className="mt-4 text-center text-sm text-green-700 bg-green-100 p-3 rounded-lg font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {successMessage}
            </motion.div>
          )}
          
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">
              {showSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            </span>
            <button
              type="button"
              className="font-semibold text-green-600 hover:text-green-700 hover:underline focus:outline-none transition"
              onClick={() => { 
                setShowSignup(!showSignup); 
                setError(null); 
                setSuccessMessage(null); // <-- Add this line to clear the success message
              }}
            >
              {showSignup ? 'Log In' : 'Create an account'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}