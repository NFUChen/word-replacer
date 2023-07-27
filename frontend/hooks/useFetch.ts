import { useEffect } from "react";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { useToast } from "@/components/ui/use-toast";
import { ErrorMessge, axiosInstance as axios } from "@/base/baseAxios";
import { AxiosRequestConfig } from "axios";

type BackendResponse<T> = {
  data: T,
  error: string,
}

export const useFetch = <Params, Response>(
  { url, args }: { url: string; args?: AxiosRequestConfig<Params> },
  config?: SWRConfiguration,
): SWRResponse<BackendResponse<Response>> => {
  const { toast } = useToast();

  const request = async (url: string, request?: AxiosRequestConfig<Params>) => {
    try {
      const response = await axios.get(url, request);
      return response.data;
    } catch (e) {
      const error = e as ErrorMessge;
      return Promise.reject(error);
    }
  };

  const element = args
    ? {
        fetcher: async ({ url, args }: { url: string; args?: AxiosRequestConfig<Params> }) => await request(url, args),
        requestArgs: { url, args },
      }
    : {
        fetcher: async (url: string) => await request(url),
        requestArgs: url
      };

  const response = useSWR<BackendResponse<Response>>(element.requestArgs, element.fetcher, { errorRetryCount: 0, ...config });

  useEffect(() => {
    if (response.error) {
      toast({
        title: "發生錯誤",
        variant: "destructive",
        description: response.error.message,
      });
    }
  }, [response.error, toast]);
  
  useEffect(() => {
    if (response.data?.error) {
      toast({
        title: "警告",
        variant: "destructive",
        description: response.data?.error,
      });
    }
  }, [response.data, toast])

  return { ...response };
};
