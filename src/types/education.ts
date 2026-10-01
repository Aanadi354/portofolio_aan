export type EducationFormValues = {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: string;
  description: string;
  logoUrl: string;
  order: number;
};

export type EducationActionState = {
  success: boolean;
  message: string;
};