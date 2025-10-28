import { User } from 'firebase/auth';
import { create } from 'zustand';

export interface FirestoreUser {
  uid: string;
  email: string;
  role: 'patient' | 'doctor' | 'psychologist' | 'guest';
  status?: 'online' | 'offline' | 'in-service';
  profile?: {
    name: string;
    phone: string;
    specialty?: string; // Solo para doctores y psicólogos
    license?: string; // Solo para doctores y psicólogos
  };
}

interface AuthState {
  user: User | null;
  firestoreUser: FirestoreUser | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setFirestoreUser: (firestoreUser: FirestoreUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firestoreUser: null,
  loading: true,
  setUser: (user) => set({ user }),
  setFirestoreUser: (firestoreUser) => set({ firestoreUser }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, firestoreUser: null }),
}));
