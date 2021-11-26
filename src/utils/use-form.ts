import React, { useState } from "react";

export type UseFormProps<T> = {
  initial: T;
  handleSubmit: (values: T, loading: UseForm<T>["wrapLoading"]) => void;
  validate?: {
    [K in keyof T]?: (value: T[K]) => string | true;
  };
};

export type UseForm<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  validate: () => boolean;
  reset: () => void;
  resetErrors: () => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof T, string>>>
  >;
  setValue: <K extends keyof T, V extends T[K]>(key: K, value: V) => void;
  onSubmit: (event?: React.FormEvent) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  wrapLoading: (p: Promise<any>) => void;
  opened: boolean;
  open: (values?: Partial<T>) => void;
  close: () => void;
};

const useForm = <T extends Record<string, any>>({
  initial,
  validate,
  handleSubmit,
}: UseFormProps<T>): UseForm<T> => {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  const valid = (): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof T, string>> = {};
    for (const key in values) {
      const error = validate?.[key]?.(values[key]);
      if (error && error !== true) {
        errors[key] = error;
        isValid = false;
      }
    }
    setErrors(errors);
    return isValid;
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  const resetErrors = () => {
    setErrors({});
  };

  const setValue = <K extends keyof T, V extends T[K]>(key: K, value: V) => {
    setValues((values) => ({ ...values, [key]: value }));
    setError(key, null);
  };

  const setError = (key: keyof T, error: string | null) => {
    setErrors((errors) => ({ ...errors, [key]: error }));
  };

  const wrapLoading = (p: Promise<any>) => {
    setLoading(true);
    p.finally(() => setLoading(false));
  };

  const onSubmit = (event?: React.FormEvent) => {
    event && event.preventDefault();
    if (valid()) {
      handleSubmit(values, wrapLoading);
    }
  };

  const open = (values?: Partial<T>) => {
    if (values) {
      Object.entries(values).forEach(([key, value]) => setValue(key, value));
    }
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
    reset();
  };

  return {
    values,
    errors,
    validate: valid,
    reset,
    resetErrors,
    setValues,
    setErrors,
    setValue,
    onSubmit,
    loading,
    setLoading,
    wrapLoading,
    opened,
    open,
    close,
  };
};

export default useForm;
