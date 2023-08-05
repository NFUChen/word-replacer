import { useEffect } from "react";
import useSWRMutation, { SWRMutationConfiguration, SWRMutationResponse } from "swr/mutation";
import { useToast } from "@/components/ui/use-toast";
import { Key } from "swr";
import { ErrorMessge, axiosInstance as axios } from "@/utils/baseAxios";

type FetchMethod = "post" | "patch" | "delete";

type BackendResponse<T> = {
  data: T;
  error: string;
};

export const useMutation = <Request, Response>(
  method: FetchMethod,
  url: string,
  config?: SWRMutationConfiguration<BackendResponse<Response>, ErrorMessge, Key, Request, any>,
): SWRMutationResponse<BackendResponse<Response>, ErrorMessge, Key, Request> => {
  const { toast } = useToast();

  const request = async (method: FetchMethod, url: string, request: any) => {
    try {
      const response = await axios[method](url, { ...request });
      return response.data;
    } catch (e) {
      const error = e as ErrorMessge;
      return Promise.reject(error);
    }
  };

  let fetcher;

  switch (method) {
    case "post":
      fetcher = async (url: string, { arg }: { arg: Request }) => await request(method, url, arg);
      break;
    case "patch":
      fetcher = async (url: string, { arg }: { arg: Request }) => await request(method, url, arg);
      break;
    case "delete":
      fetcher = async (url: string, { arg }: { arg: Request }) => await request(method, url, { params: { ...arg } });
      break;
  }

  const response = useSWRMutation<BackendResponse<Response>, ErrorMessge, Key, Request>(url, fetcher, config);

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
  }, [response.data, toast]);

  return { ...response };
};
