import {
  STORE_FORM_STEPS,
  StoreFormData,
  StoreFormStep,
} from "@/schema/store.schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StoreFormState = {
  step: StoreFormStep;
  data: StoreFormData;

  // Actions
  setStep: (step: StoreFormStep) => void;
  setField: <K extends keyof StoreFormData>(
    k: K,
    value: StoreFormData[K]
  ) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
};

const INITIAL_STATE = {
  step: STORE_FORM_STEPS[0],
  data: {},
};

export const useStoreForm = create<StoreFormState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setField: (key, value) =>
        set((state) => ({ data: { ...state.data, [key]: value } })),
      nextStep: () => {
        const current = get().step;
        const idx = STORE_FORM_STEPS.indexOf(current);
        if (idx < STORE_FORM_STEPS.length - 1) {
          set({ step: STORE_FORM_STEPS[idx + 1] });
        }
      },
      prevStep: () => {
        const current = get().step;
        const idx = STORE_FORM_STEPS.indexOf(current);
        if (idx > 0) {
          set({ step: STORE_FORM_STEPS[idx - 1] });
        }
      },
      setStep: (step) => set({ step }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "store-form-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        step: state.step,
        data: state.data,
      }),
    }
  )
);
