import { atom, DefaultValue } from "recoil";

export const TOKEN_NAME = "hoshi-note$token";

export const token = atom<string | null>({
  key: "token/state",
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      const t = localStorage.getItem(TOKEN_NAME);
      if (t !== null) {
        setSelf(t);
      }
      onSet((value: string | null | DefaultValue) => {
        if (value instanceof DefaultValue || !value) {
          localStorage.removeItem(TOKEN_NAME);
        } else {
          localStorage.setItem(TOKEN_NAME, value);
        }
      });
    },
  ],
});
