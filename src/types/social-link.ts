export type SocialLinkFormValues = {
  id: number;
  platform: string;
  label: string;
  url: string;
  icon: string;
  order: number;
  isActive: boolean;
};

export type SocialLinkActionState = {
  success: boolean;
  message: string;
};