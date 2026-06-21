import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { authKey } from "./authKey";
import { deleteCookies } from "./deleteCookie";

export const logoutUser = (router: AppRouterInstance, path: string = "/") => {
  deleteCookies([authKey], path);
  router.refresh();
};
