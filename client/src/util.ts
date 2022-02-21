export const API_URL = "http://localhost:8001";

export const send_url = (url: string): string => {
  return url.replace("https://", "");
};
