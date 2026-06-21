import { FieldValues } from "react-hook-form";

export const userRegister = async (formData: FieldValues) => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005/api/v1';
  console.log("apibase", apiBase)

  const res = await fetch(
    `${apiBase}/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const userInfo = await res.json();
  return userInfo;
};
