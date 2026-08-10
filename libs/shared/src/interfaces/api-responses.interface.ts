import { ApplicationStatus } from '../enums';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CustomerResponse {
  id: string;
  name: string;
  lastName: string;
  document: string;
  email: string;
  phone: string;
  status: string;
}

export interface ApplicationResponse {
  id: string;
  radicado: string;
  clientId?: string;
  channel: string;
  status: ApplicationStatus;
  createdAt: string | Date;
  offerResult?: {
    approvedAmount?: number | string;
    amount?: number | string;
  };
}

export interface DashboardData {
  customer: CustomerResponse;
  applications: ApplicationResponse[];
  applicationsWarning?: string;
}

export interface FinancialSummaryData {
  customer: CustomerResponse;
  financialSummary: {
    totalApplications: number;
    activeRisk: number;
  };
  applications: ApplicationResponse[];
  applicationsWarning?: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string | Date;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserValidationResponse {
  isEligible: boolean;
  existsInDb: boolean;
  activeApplicationId?: string | null;
}

export interface SimulationResponse {
  approvedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  termMonths: number;
}

export interface AcceptOfferResponse {
  id: string;
  status: ApplicationStatus;
  acceptedAt: string | Date;
}

export interface AbandonApplicationResponse {
  id: string;
  status: ApplicationStatus;
  abandonedAt: string | Date;
  reason: string;
}

export interface ApplicationEventResponse {
  id: string;
  applicationId: string;
  eventType: string;
  description: string;
  createdAt: string | Date;
}

export interface EnrichedApplicationResponse extends Omit<
  ApplicationResponse,
  'clientId' | 'offerResult'
> {
  customer: CustomerResponse | null;
}
