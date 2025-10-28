import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'patient' as 'patient' | 'doctor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Actualizar perfil
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Crear documento en Firestore
      const userData: any = {
        uid: userCredential.user.uid,
        email: formData.email,
        role: formData.role,
        profile: {
          name: formData.name,
          phone: formData.phone,
        },
      };

      // Solo agregar status para doctores
      if (formData.role === 'doctor') {
        userData.status = 'offline';
        userData.profile.specialty = '';
        userData.profile.license = '';
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      // La redirección se maneja automáticamente en App.tsx
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
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
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Crear Cuenta</h2>
          <p className='mt-2 text-center text-sm text-gray-600'>Únete a Medlink como paciente o doctor</p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && <Alert type='error' message={error} />}

          <div className='space-y-4'>
            <div>
              <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
                Tipo de cuenta
              </label>
              <select
                id='role'
                name='role'
                required
                className='input-field'
                value={formData.role}
                onChange={handleChange}
              >
                <option value='patient'>Paciente</option>
                <option value='doctor'>Doctor</option>
              </select>
            </div>

            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Nombre completo
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='input-field pl-10'
                  placeholder='Tu nombre completo'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                Teléfono
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Phone className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='phone'
                  name='phone'
                  type='tel'
                  required
                  className='input-field pl-10'
                  placeholder='+57 300 123 4567'
                  value={formData.phone}
                  onChange={handleChange}
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
                  autoComplete='new-password'
                  required
                  className='input-field pl-10'
                  placeholder='Mínimo 6 caracteres'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                Confirmar contraseña
              </label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required
                  className='input-field pl-10'
                  placeholder='Repite tu contraseña'
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  Crear Cuenta
                  <ArrowRight className='ml-2 h-4 w-4' />
                </>
              )}
            </button>
          </div>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              ¿Ya tienes cuenta?{' '}
              <Link to='/login' className='font-medium text-blue-600 hover:text-blue-500'>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
