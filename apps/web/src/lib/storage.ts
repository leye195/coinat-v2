export const setLocalStorageData = (key: string, value: any) => {
  const stringifiedValue =
    typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key, stringifiedValue);
};

export const getLocalStorageData = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const clearLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
