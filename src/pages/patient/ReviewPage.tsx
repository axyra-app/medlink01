import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Send, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { firestoreUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      setLoading(false);
      return;
    }

    try {
      // Simular llamada a Cloud Function leaveReview
      const response = await fetch('/api/leaveReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: id,
          patientId: firestoreUser?.uid,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la reseña');
      }

      setSuccess(true);

      // Redirección después de 2 segundos
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='card text-center max-w-md w-full'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>¡Reseña Enviada!</h2>
            <p className='text-sm text-gray-600'>
              Gracias por tu calificación. Tu opinión nos ayuda a mejorar nuestro servicio.
            </p>
          </div>
          <div className='flex justify-center'>
            <LoadingSpinner size='sm' />
          </div>
          <p className='text-xs text-gray-500 mt-2'>Redirigiendo al inicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>Calificar Servicio</h1>
              <p className='text-sm text-gray-600'>¿Cómo fue tu experiencia?</p>
            </div>
            <div className='flex items-center space-x-2 text-yellow-600'>
              <Star className='h-5 w-5' />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Información del servicio */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Servicio Completado</h3>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <div className='w-2 h-2 bg-green-600 rounded-full' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Consulta médica</p>
                <p className='text-sm text-gray-600'>Servicio ID: {id}</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-2 h-2 bg-blue-600 rounded-full' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Doctor</p>
                <p className='text-sm text-gray-600'>Dr. Nombre del Doctor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de reseña */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Califica tu experiencia</h3>

          {error && <Alert type='error' message={error} />}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Calificación con estrellas */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>Calificación general</label>
              <div className='flex space-x-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className='h-8 w-8 fill-current' />
                  </button>
                ))}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {rating === 0 && 'Selecciona una calificación'}
                {rating === 1 && 'Muy malo'}
                {rating === 2 && 'Malo'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bueno'}
                {rating === 5 && 'Excelente'}
              </p>
            </div>

            {/* Comentario */}
            <div>
              <label htmlFor='comment' className='block text-sm font-medium text-gray-700 mb-2'>
                Comentario (opcional)
              </label>
              <textarea
                id='comment'
                rows={4}
                className='input-field resize-none'
                placeholder='Cuéntanos sobre tu experiencia con el doctor...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <p className='text-xs text-gray-500 mt-1'>Máximo 500 caracteres</p>
            </div>

            {/* Botón de envío */}
            <button
              type='submit'
              disabled={loading || rating === 0}
              className='btn-primary w-full flex items-center justify-center'
            >
              {loading ? (
                <>
                  <LoadingSpinner size='sm' />
                  <span className='ml-2'>Enviando reseña...</span>
                </>
              ) : (
                <>
                  Enviar Reseña
                  <Send className='ml-2 h-4 w-4' />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Información adicional */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>💡 Tu opinión es importante</h3>
          <div className='space-y-2 text-sm text-blue-800'>
            <p>• Las reseñas ayudan a otros pacientes a elegir</p>
            <p>• Los doctores mejoran con tu feedback</p>
            <p>• Tu calificación es anónima</p>
            <p>• Puedes editar tu reseña más tarde</p>
          </div>
        </div>

        {/* Botón para omitir */}
        <div className='text-center'>
          <button onClick={() => navigate('/home')} className='text-sm text-gray-500 hover:text-gray-700 underline'>
            Omitir por ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
