import { GENDERS } from "@/enums";

export type UpdateProfileRequestType = {
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  dob: string;
  gender: GENDERS;
  avatar?: string;
  email: string;
};
