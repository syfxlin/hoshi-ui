import { atom, AtomEffect, AtomOptions, DefaultValue } from "recoil";

type EffectListener<T> = (
  newValue: T | DefaultValue,
  oldValue: T | DefaultValue
) => void;

type AtomValue<T> =
  | T
  | DefaultValue
  | Promise<T | DefaultValue>
  | ((param: T | DefaultValue) => T | DefaultValue);

export const atomEffect = <T>(options: AtomOptions<T>) => {
  const listeners: EffectListener<T>[] = [];
  const on = (listener: EffectListener<T>) => listeners.push(listener);
  const off = (listener: EffectListener<T>) => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
  const operate: {
    set?: (value: AtomValue<T>) => void;
    reset?: () => void;
  } = {};
  const effect: AtomEffect<T> = ({ setSelf, resetSelf, onSet }) => {
    operate.set = setSelf;
    operate.reset = resetSelf;
    onSet((newValue, oldValue) =>
      listeners.forEach((listener) => listener(newValue, oldValue))
    );
  };
  const state = atom({
    ...options,
    effects_UNSTABLE: [...(options.effects_UNSTABLE ?? []), effect],
  });
  return {
    state,
    on,
    off,
    set: (value: AtomValue<T>) => {
      if (!operate.set) {
        throw new Error("Atom effect not init");
      }
      return operate.set(value);
    },
    reset: () => {
      if (!operate.reset) {
        throw new Error("Atom effect not init");
      }
      return operate.reset();
    },
  };
};
