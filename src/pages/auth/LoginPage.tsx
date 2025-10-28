import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirección se maneja automáticamente en App.tsx
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <div className='mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center'>
            <span className='text-white font-bold text-xl'>M</span>
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Iniciar Sesión</h2>
          <p className='mt-2 text-center text-sm text-gray-600'>Accede a tu cuenta de Medlink</p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && <Alert type='error' message={error} />}

          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Correo electrónico
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='input-field pl-10'
                  placeholder='tu@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Contraseña
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='input-field pl-10'
                  placeholder='Tu contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center'>
              {loading ? (
                <LoadingSpinner size='sm' />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className='ml-2 h-4 w-4' />
                </>
              )}
            </button>
          </div>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              ¿No tienes cuenta?{' '}
              <Link to='/signup' className='font-medium text-blue-600 hover:text-blue-500'>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
