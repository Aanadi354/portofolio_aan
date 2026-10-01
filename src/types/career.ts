export type CareerFormValues = {
  id: number;
  company: string;
  position: string;
  type: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string;
  logoUrl: string;
  order: number;
};

export type CareerActionState = {
  success: boolean;
  message: string;
};