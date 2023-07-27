import axios, { AxiosError } from "axios";

export type ErrorMessge = { message: string; statusCode: number };

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// add interceptor
axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  e => {
    const error = e as AxiosError;
    const errorMessge: ErrorMessge = { message: "未知錯誤", statusCode: error.response ? error.response.status : NaN };

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      errorMessge.message = "請求超時";
    }

    if (error.code === "ERR_NETWORK") {
      errorMessge.message = "網路錯誤";
    }

    switch (error.response?.status) {
      case 400:
        errorMessge.message = error.message;
        break;
      case 401:
        errorMessge.message = "使用者無權限";
        break;
      case 404:
        errorMessge.message = "請求不存在";
        break;
      case 405:
        errorMessge.message = "使用者驗證失敗";
        break;
      case 500:
        errorMessge.message = "伺服器發生問題";
        break;
    }
    return Promise.reject(errorMessge);
  },
);
