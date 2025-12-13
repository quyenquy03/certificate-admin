import { UserResponseType } from "../users";

export type OrganizationMemberResponseType = {
  userId: string;
  walletAddress: string;
  addedTxHash: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isOwner: boolean;
  organizationId: string;
  user: UserResponseType;
};
