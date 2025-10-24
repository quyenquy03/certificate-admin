import { UserResponseType } from "@/types";
import { create } from "zustand";

type AccountStoreState = {
  // states type
  currentUser: UserResponseType | null;
  accessToken: string | null;

  // methods
  setCurrentUser: (user: UserResponseType | null) => void;
  setAccessToken: (token: string | null) => void;
};

export const account = create<AccountStoreState>((set) => ({
  currentUser: null,
  accessToken: null,

  setCurrentUser: (currentUser: UserResponseType | null) =>
    set({
      currentUser,
    }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
}));
