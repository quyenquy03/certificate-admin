export const PAGE_URLS = {
  // auths
  LOGIN: "/login",
  FORGET_PASSWORD: "/forget-password",
  FORBIDDEN: "/forbidden",

  // publish
  HOME: "/",
  REGISTER_ORGANIZATION: "/register-organization",

  // admins
  ADMIN_DASHBOARD: "/admins/dashboard",
  ADMIN_USERS: "/admins/users",
  ADMIN_ORGANIZATIONS: "/admins/organizations",
  ADMIN_REGISTRATIONS: "/admins/registrations",
  ADMIN_CERTIFICATE_TYPES: "/admins/certificate-types",

  // organizations
  ORGANIZATIONS: "/organizations/",
  ORGANIZATIONS_DASHBOARD: "/organizations/dashboard",
};

export const AUTH_PAGE_URLS = [PAGE_URLS.LOGIN, PAGE_URLS.FORGET_PASSWORD];

export const PUBLISH_PAGE_URLS = [PAGE_URLS.REGISTER_ORGANIZATION];

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
