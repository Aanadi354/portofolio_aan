export type ProfileFormValues = {
  name: string;
  headline: string;
  bio: string;
  location: string | null;
  email: string;
  phone: string | null;
  profileImage: string | null;
  resumeUrl: string | null;
};

export type ProfileActionState = {
  success: boolean;
  message: string;
};