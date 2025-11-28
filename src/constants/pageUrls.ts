export const PAGE_URLS = {
  // auths
  LOGIN: "/login",
  FORGET_PASSWORD: "/forget-password",
  FORBIDDEN: "/forbidden",

  // publish
  HOME: "/",
  REGISTER_ORGANIZATION: "/register-organization",
  CERTIFICATE_LOOKUP: "/certificates",
  CERTIFICATE_DETAIL: "/certificates",

  // admins
  ADMIN_DASHBOARD: "/admins/dashboard",
  ADMIN_USERS: "/admins/users",
  ADMIN_ORGANIZATIONS: "/admins/organizations",
  ADMIN_REGISTRATIONS: "/admins/registrations",
  ADMIN_CERTIFICATE_TYPES: "/admins/certificate-types",
  ADMIN_CERTIFICATE_REQUESTS: "/admins/certificate-requests",

  // organizations
  ORGANIZATIONS: "/organizations/",
  ORGANIZATIONS_DASHBOARD: "/organizations/dashboard",
  MY_ORGANIZATIONS: "/organizations/my-organization",
  ORGANIZATIONS_MEMBERS: "/organizations/members",
  ORGANIZATIONS_CERTIFICATES: "/organizations/certificates",
  ORGANIZATION_CREATE_CERTIFICATE: "/organizations/certificates/create",
};

export const AUTH_PAGE_URLS = [PAGE_URLS.LOGIN, PAGE_URLS.FORGET_PASSWORD];

export const PUBLISH_PAGE_URLS = [
  PAGE_URLS.REGISTER_ORGANIZATION,
  PAGE_URLS.CERTIFICATE_LOOKUP,
  PAGE_URLS.CERTIFICATE_DETAIL,
];

export const ADMIN_PAGE_URLS = [
  PAGE_URLS.ADMIN_DASHBOARD,
  PAGE_URLS.ADMIN_USERS,
  PAGE_URLS.ADMIN_ORGANIZATIONS,
  PAGE_URLS.ADMIN_REGISTRATIONS,
  PAGE_URLS.ADMIN_CERTIFICATE_TYPES,
];

export const ORG_PAGE_URLS = [
  PAGE_URLS.ORGANIZATIONS,
  PAGE_URLS.ORGANIZATIONS_DASHBOARD,
];

export const HIDDEN_FOOTER_CLIENT_URLS = [
  PAGE_URLS.CERTIFICATE_LOOKUP,
  PAGE_URLS.CERTIFICATE_DETAIL,
];
