export type ProjectFormValues = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  status: string;
  featured: boolean;
  order: number;
  startDate: string;
  endDate: string;
};

export type ProjectActionState = {
  success: boolean;
  message: string;
};