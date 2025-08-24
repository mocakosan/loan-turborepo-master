import { create } from "zustand";

interface SignInDialogState {
  open: boolean;
  callbackUrl: string | null;
  setOpen: (value: boolean, url?: string) => void;
}

export const useSignInDialogStore = create<SignInDialogState>((set) => ({
  open: false,
  callbackUrl: null,
  setOpen: (value: boolean, url?: string) =>
    set({ open: value, callbackUrl: url || null }),
}));
