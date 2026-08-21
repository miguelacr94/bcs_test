export interface FamilyReference {
  name: string;
  phone: string;
  relationship: string;
}

export interface ValidateApplicationData {
  familyReference1?: FamilyReference;
  [key: string]: any;
}

export interface OfferDetails {
  approvedAmount?: number;
  totalAmount?: number;
  rate?: number;
  termMonths?: number;
}

export interface OfferResult {
  success?: boolean;
  message?: string;
  offerDetails?: OfferDetails;
  approvedAmount?: number;
  amount?: number;
  [key: string]: any;
}
