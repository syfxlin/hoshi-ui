import { RecoilState, RecoilValue, useRecoilCallback } from "recoil";
import React from "react";

interface RecoilUtils {
  get: <T>(atom: RecoilValue<T>) => T;
  getAsync: <T>(atom: RecoilValue<T>) => Promise<T>;
  set: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
  reset: <T>(atom: RecoilState<T>) => void;
}

// @ts-ignore
export const recoil: RecoilUtils = {};

export const RecoilLink: React.FC = () => {
  recoil.get = useRecoilCallback(
    ({ snapshot }) =>
      (atom) =>
        snapshot.getLoadable(atom).contents,
    []
  );

  recoil.getAsync = useRecoilCallback(
    ({ snapshot }) =>
      (atom) =>
        snapshot.getPromise(atom),
    []
  );

  recoil.set = useRecoilCallback(({ set }) => set, []);

  recoil.reset = useRecoilCallback(({ reset }) => reset, []);

  return null;
};
