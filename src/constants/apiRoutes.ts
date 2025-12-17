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
  GET_ORGANIZATION: (id: string) => `/organizations/get-organizations/${id}`,
  GET_MY_ORGANIZATION: "/organizations/my-organizations",
  REGISTER_ORGANIZATION: "/organizations/register",
  GET_ORGANIZATION_REGISTRATIONS: "/organizations/registrations",
  ADD_ORGANIZATION_MEMBER: "/organizations/add-member",
  GET_ORGANIZATION_MEMBERS: (id: string) => `/organizations/members/${id}`,
  REMOVE_ORGANIZATION_MEMBER: (id: string, userId: string) =>
    `/organizations/${id}/members/${userId}/remove`,
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
  UPDATE_CERTIFICATE: (id: string) => `/certificates/update/${id}`,
  CREATE_CERTIFICATE: "/certificates/create-certificate",
  IMPORT_CERTIFICATES: "/certificates/import-certificates",
  GET_CERTIFICATES: "/certificates/get-certificates",
  GET_CERTIFICATE: (id: string) => `/certificates/by-id/${id}`,
  GET_ORGANIZATIONS_CERTIFICATES: (id: string) =>
    `/certificates/organization-certificates/${id}`,
  GET_CERTIFICATE_REQUESTS: "/certificates/certificate-requests",
  GET_CERTIFICATE_REQUESTS_SPECIFIC: (id: string) =>
    `/certificates/certificate-requests/${id}/certificate`,
  SUBMIT_CERTIFICATE_TO_VERIFY: "/certificates/submit-certificate",
  APPROVE_CERTIFICATE_REQUEST: (id: string) =>
    `/certificates/certificate-requests/${id}/approve`,
  REJECT_CERTIFICATE_REQUEST: (id: string) =>
    `/certificates/certificate-requests/${id}/reject`,

  REVOKE_CERTIFICATE: (id: string) => `/certificates/revoke/${id}`,
  APPROVE_CERTIFICATE: (id: string) => `/certificates/approve/${id}`,
  DELETE_CERTIFICATE: (id: string) => `/certificates/delete/${id}`,

  // uploads
  UPLOAD_AUTHOR_IMAGE: "/uploads/author-image",
  UPLOAD_PROFILE_IMAGE: "/uploads/profile-image",
  UPLOAD_AUTHOR_DOCUMENT: "/uploads/author-document",
};
