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
};
