import { USER_ROLES } from "@/enums";

export type UserResponseType = {
  id: string;
  userName: string;
  email: string;
  isFirstLogin: boolean;
  role: USER_ROLES;
  firstName: string;
  lastName: string;
  walletAddress: string;
  address: string;
  phone: string;
  dob: string;
  avatar: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};
