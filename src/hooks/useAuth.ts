import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, firestoreUser, loading, setUser, setFirestoreUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Suscribirse a los datos del usuario en Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = { uid: user.uid, ...doc.data() } as any;
            setFirestoreUser(userData);
          } else {
            setFirestoreUser(null);
          }
        });

        // Cleanup function
        return () => unsubscribeUser();
      } else {
        setFirestoreUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setFirestoreUser, setLoading]);

  return {
    user,
    firestoreUser,
    loading,
    isAuthenticated: !!user,
    role: firestoreUser?.role || 'guest',
  };
};
