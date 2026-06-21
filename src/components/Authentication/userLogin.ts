import { FieldValues } from "react-hook-form";
import { authKey } from "./authKey";

export const userLogin = async (formData: FieldValues) => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005/api/v1';

  const res = await fetch(
    `${apiBase}/admin/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const userInfo = await res.json();
  console.log("user login res", userInfo);

  const token = userInfo?.data?.token;
  console.log("user login token", token);
  if (token && typeof window !== "undefined") {
    document.cookie = `${authKey}=${token}; path=/; max-age=2592000; SameSite=Strict; Secure`;
  }

  return userInfo;
};
