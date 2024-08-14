import Cookies from 'js-cookie';

// Get the value of a cookie
export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

// Set the value of a cookie
export function setCookie(
  name: string,
  value: string,
  options?: Cookies.CookieAttributes,
): void {
  Cookies.set(name, value, options);
}

// Remove a cookie
export function removeCookie(name: string): void {
  Cookies.remove(name);
}
