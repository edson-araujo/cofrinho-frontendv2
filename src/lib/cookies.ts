import Cookies from "js-cookie";

export function setAuthCookie(token: string) {
  Cookies.set("auth_token", token, { expires: 7, secure: true, sameSite: "strict" });
}

export function getAuthCookie() {
  return Cookies.get("auth_token");
}

export function removeAuthCookie() {
  Cookies.remove("auth_token");
}
