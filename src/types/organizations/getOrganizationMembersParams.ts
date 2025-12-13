import { BasePaginationParams } from "../bases";

export type GetOrganizationMembersParams = {
  organizationId: string;
} & BasePaginationParams;
