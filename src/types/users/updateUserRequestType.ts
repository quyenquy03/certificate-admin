import { UserResponseType } from "./userResponseType";

export type UpdateUserRequestType = UserResponseType & {
  isLooked: boolean;
};
