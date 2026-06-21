export const deleteCookies = (keys: string[]) => {
  if (typeof window !== "undefined") {
    for (const key of keys) {
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
    }
  }
};
