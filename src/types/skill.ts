export type SkillFormValues = {
  id: number;
  name: string;
  proficiency: number;
  icon: string;
  order: number;
  skillCategoryId: number;
};

export type SkillCategoryFormValues = {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  skills: SkillFormValues[];
};

export type SkillActionState = {
  success: boolean;
  message: string;
};