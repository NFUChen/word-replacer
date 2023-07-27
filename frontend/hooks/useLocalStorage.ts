import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, InitialValue: T): [value: T, setValue: Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(InitialValue);

  // Initial fetch from storage
  useEffect(() => {
    if (!localStorage.getItem(key)) return;
    setValue(JSON.parse(localStorage.getItem(key) ?? ""));
  }, [key]);

  // Persist to storage
  useEffect(() => {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
