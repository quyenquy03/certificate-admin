import { USER_ROLES } from "@/enums";

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "admin",
  [USER_ROLES.ORGANIZATION]: "organization",
};

export const USER_ROLE_OPTIONS = [
  {
    value: USER_ROLES.ADMIN,
    label: USER_ROLE_LABELS[USER_ROLES.ADMIN],
  },
  {
    value: USER_ROLES.ORGANIZATION,
    label: USER_ROLE_LABELS[USER_ROLES.ORGANIZATION],
  },
];
