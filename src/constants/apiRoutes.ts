export const API_ROUTES = {
  LOGIN: "/auth/credential-login",

  // account
  GET_MY_PROFILE: "/account/me",
  UPDATE_PROFILE: "/account/update-profile",
  CHANGE_PASSWORD: "/account/change-password",

  // admin users
  GET_USERS: "/users/get-users",
  GET_USER: "/users/get-user",
  GET_DELETED_USERS: "/users/get-deleted-users",
  RESTORE_USER: "/users/restore-user",
  RESET_PASSWORD: "/users/reset-password",
  CREATE_NEW_USER: "/users/create-user",
  UPDATE_USER: "/users/update-user",
  DELETE_USER: "/users/delete-user",

  // organizations
  GET_ORGANIZATION_REGISTRATION: "/organizations/registrations",
  GET_ORGANIZATIONS: "/organizations/get-organizations",
  GET_MY_ORGANIZATION: "/organizations/my-organizations",
  REGISTER_ORGANIZATION: "/organizations/register",
  GET_ORGANIZATION_REGISTRATIONS: "/organizations/registrations",
  APPROVE_REGISTRATION: (id: string) =>
    `/organizations/registrations/${id}/approve`,
  REJECT_REGISTRATION: (id: string) =>
    `/organizations/registrations/${id}/reject`,

  // certificates
  DELETE_CERTIFICATE_TYPE: (id: string) => `/certificates/types/${id}/delete`,
  GET_CERTIFICATE_TYPES: "/certificates/types/get-types",
  GET_CERTIFICATE_TYPE: (id: string) => "/certificates/types/" + id,
  CREATE_CERTIFICATE_TYPE: "/certificates/types/create",
  UPDATE_CERTIFICATE_TYPE: (id: string) => `/certificates/types/${id}/update`,
  ACTIVATE_CERTIFICATE_TYPE: (id: string) =>
    `/certificates/types/${id}/activate`,
  DEACTIVATE_CERTIFICATE_TYPE: (id: string) =>
    `/certificates/types/${id}/deactivate`,
  CREATE_CERTIFICATE: "/certificates/create-certificates",
  GET_CERTIFICATES: "/certificates/get-certificates",
  GET_ORGANIZATIONS_CERTIFICATES: (id: string) =>
    `/certificates/organization-certificates/${id}`,
};
