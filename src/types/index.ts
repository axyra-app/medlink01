export interface ServiceRequest {
  id: string;
  patientId: string;
  doctorId?: string;
  status: 'pending' | 'accepted' | 'in-service' | 'in-progress' | 'completed';
  symptoms: string;
  urgency: 'low' | 'medium' | 'high';
  patientLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  patientGeohash: string;
  createdAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface DoctorLocation {
  doctorId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface Review {
  id: string;
  serviceId: string;
  patientId: string;
  doctorId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface GeohashNeighbors {
  center: string;
  neighbors: string[];
}

export type ServiceStatus = ServiceRequest['status'];
export type UserRole = 'patient' | 'doctor' | 'psychologist' | 'guest';
export type DoctorStatus = 'online' | 'offline' | 'in-service';
