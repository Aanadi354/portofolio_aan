export type SiteSettingType = "STRING" | "NUMBER" | "BOOLEAN" | "JSON" | "TEXT" | "IMAGE";

export type SiteSettingFormValue = {
  id: number;
  key: string;
  value: string;
  type: SiteSettingType;
  label: string;
  description: string;
  group: string;
};

export type SiteSettingActionState = {
  success: boolean;
  message: string;
};