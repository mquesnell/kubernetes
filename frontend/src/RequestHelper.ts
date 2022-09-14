import axios, { AxiosResponse, AxiosError } from "axios";
import { getDocumentCookie } from "./cookieAccess";

export const API_URL = "http://127.0.0.1:41997";
// export const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "";
// export const API_URL = "http://" + process.env.BACKEND_SERVICE_HOST + ':' + process.env.BACKEND_SERVICE_PORT;

export interface SetupRequestArgs {
  url: string;
  path: string;
  method: any;
  body?: any;
  config?: AxiosConfig;
  data?: any;
}

export interface RequestParams {
  endpoint: string;
  method: any;
  body?: any;
  config?: AxiosConfig;
}

export interface AxiosConfig {
  url?: string;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  headers: any;
  data?: any; // Axios requires data to be set in order to specify content-type
  withCredentials: any;
  validateStatus: (status: number) => boolean;
  signal?: AbortSignal;
}

const setupRequest = (params: SetupRequestArgs): RequestParams => {
  const endpoint =
    params.url === ""
      ? `${API_URL}/${params.path}`
      : `${params.url}/${params.path}`;

  const headersWithXSRFAndTimestamp = {
    ...getConfigHeaders(params.config),
    ...getXsrfHeader(),
    "Content-Type": "application/json",
    "X-TIMESTAMP": new Date(Date.now()).toISOString(),
  };

  return {
    endpoint: endpoint,
    method: params.method,
    body: params.body,
    config: {
      onUploadProgress: getConfigProgressCallback(params.config),
      headers: headersWithXSRFAndTimestamp,
      data: params.data || null,
      withCredentials: false,
      validateStatus: params.config?.validateStatus
        ? params.config.validateStatus
        : (status) => !(status === 302),
      url: `${API_URL}`,
      signal: params.config?.signal,
    },
  };
};

export const get = async (
  url: string,
  path: string,
  headers?: any
): Promise<AxiosResponse<any>> => {
  const { endpoint, config } = setupRequest({ url, path, method: "get" });
  const updatedConfig = {
    ...config,
    headers: { ...config?.headers, ...headers },
  };

  return await axios
    .get(endpoint, updatedConfig)
    .then((response) => {
      return checkStatusCode(response);
    })
    .catch((error: Error) => {
      throw new Error(`Get request failed: ${error.message}, URL: ${endpoint}`);
    });
};

export const put = async (
  path: string,
  body: any,
  axiosConfig?: AxiosConfig
): Promise<AxiosResponse<any>> => {
  const { endpoint, config } = setupRequest({
    url: "",
    path,
    method: "put",
    body,
    config: axiosConfig,
  });

  return await axios
    .put(endpoint, body, config)
    .then((response) => {
      return checkStatusCode(response);
    })
    .catch((response) => {
      if (response.message === "404") {
        throw new Error("Put request failed: 404");
      }
      // Note: this isn't a permanent solution.  This redirects on any error, not just a redirect
      if (config?.url) {
        window.location.href = config.url;
      }
      // return response;
      const error: AxiosError = {
        config: {},
        response: response,
        isAxiosError: true,
        name: "Put Error",
        message: "Put Request Failed",
        toJSON: () => ({}),
      };
      throw error;
    });
};

export const post = async (
  path: string,
  body: any,
  axiosConfig?: AxiosConfig
): Promise<AxiosResponse<any>> => {
  const { endpoint, config } = setupRequest({
    url: "",
    path,
    method: "post",
    body,
    config: axiosConfig,
  });

  return await axios
    .post(endpoint, body, config)
    .then((response) => {
      if (!config?.validateStatus(response.status)) {
        const error: AxiosError = {
          config: {},
          response: response,
          isAxiosError: true,
          name: "Post Error",
          message: "Post Request Failed",
          toJSON: () => ({}),
        };
        throw error;
      }
      return checkStatusCode(response);
    })
    .catch((response) => {
      if (response.message === "404") {
        throw new Error("Post request failed: 404");
      }

      throw response;
    });
};

export const postInWorker = async (
  path: string,
  body: any,
  axiosConfig?: AxiosConfig
) => {
  const endpoint = `${API_URL}/api/${path}`;

  const headersWithXSRFAndTimestamp = {
    ...getConfigHeaders(axiosConfig),
    "X-TIMESTAMP": new Date(Date.now()).toISOString(),
  };

  const config: AxiosConfig = {
    onUploadProgress: getConfigProgressCallback(axiosConfig),
    headers: headersWithXSRFAndTimestamp,
    withCredentials: true,
    validateStatus: (status) => !(status === 302),
  };

  return await axios.post(endpoint, body, config);
};

export const remove = async (path: string, headers?: any) => {
  const { endpoint, config } = setupRequest({
    url: "",
    path,
    method: "delete",
  });
  const updatedConfig = {
    ...config,
    headers: { ...config?.headers, ...headers },
  };
  return await axios
    .delete(endpoint, updatedConfig)
    .then((response: AxiosResponse) => {
      return checkStatusCode(response);
    })
    .catch((error: Error) => {
      if (error.message === "404") {
        throw new Error("Delete request failed: 404");
      }
      // Note: this isn't a permanent solution.  This redirects on any error, not just a redirect
      if (config?.url) {
        window.location.href = config.url;
      }
    });
};

const getConfigHeaders = (config: AxiosConfig | undefined): any => {
  return config ? config.headers : {};
};

const getConfigProgressCallback = (config: AxiosConfig | undefined): any => {
  return config && config.onUploadProgress
    ? config.onUploadProgress
    : undefined;
};

export const getCookie = (name: string): string => {
  const cookies = getDocumentCookie();
  if (!cookies) {
    return "";
  }

  const cookieLookup = cookies
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith(name + "="));

  if (cookieLookup.length === 0) {
    return "";
  }

  return decodeURIComponent(cookieLookup[0].split("=")[1]);
};

const getXsrfHeader = (): any => {
  return { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") };
};

const checkForRedirect = (response: AxiosResponse) => {
  if (response.request.responseURL !== response.config.url) {
    window.location.href = response.request.responseURL;
  }
  return response;
};

const checkStatusCode = (response: AxiosResponse) => {
  if (response.status === 404) {
    window.location.href = `/error/${response.status}`;
    throw new Error(`${response.status}`);
  }

  return checkForRedirect(response);
};
