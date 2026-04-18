import { GoogleProfilePrefill, UserType } from "@/types/auth";

interface OnboardingState {
  idToken: string | null;
  role: UserType | null;
  prefill: GoogleProfilePrefill | null;
}

let state: OnboardingState = {
  idToken: null,
  role: null,
  prefill: null,
};

export const googleStore = {
  setState: (newState: OnboardingState) => {
    state = newState;
  },
  getState: () => state,
  clear: () => {
    state = { idToken: null, role: null, prefill: null };
  },
};
