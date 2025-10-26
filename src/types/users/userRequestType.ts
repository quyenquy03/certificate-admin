import { USER_ROLES } from "@/enums";

export type UserRequestType = {
  id?: string;
  email: string;
  role: USER_ROLES;
  firstName: string;
  lastName: string;
  phone?: string;
  dob: string;
  address?: string;
  avatar?: string;
};
