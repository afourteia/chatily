import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useStore } from '@/store/use-store';
import { type SuperJSONResult } from 'superjson';
import { type ProcedureIO } from '@project-name/api';
import superjson from 'superjson';
import Decimal from 'decimal.js';
superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js',
);

// declare module 'axios' {
//   export interface InternalAxiosRequestConfig {
//     _retry?: boolean;
//   }
// }

export async function postAxios<T>(apiEndpoint: string, args: any): Promise<T> {
  const { data } = await axiosInstance.post<SuperJSONResult>(
    apiEndpoint,
    superjson.serialize(args),
  );
  return superjson.deserialize(data);
}

export async function getAxios<T>(apiEndpoint: string, args: any): Promise<T> {
  const { data } = await axiosInstance.get<SuperJSONResult>(apiEndpoint, {
    params: {
      q: superjson.stringify(args),
    },
  });
  return superjson.deserialize(data);
}

const apiServerUrl = import.meta.env.VITE_APP_API_SERVER_URL
  ? import.meta.env.VITE_APP_API_SERVER_URL
  : (() => {
      throw new Error('VITE_APP_API_SERVER_URL is not defined');
    })();

const useCredentials = import.meta.env.VITE_CREDENTIALS_ENABLED === 'true';

const axiosInstance = axios.create({
  baseURL: '/api', //apiServerUrl,
  withCredentials: useCredentials,
});

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.common['Accept'] = 'application/json';

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = accessToken;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  config: InternalAxiosRequestConfig;
  resolve: (config: InternalAxiosRequestConfig) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, accessToken: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (accessToken) {
      // Update the config with the new token
      if (
        prom.config.headers &&
        typeof prom.config.headers === 'object' &&
        'set' in prom.config.headers
      ) {
        prom.config.headers.set('Authorization', `Bearer ${accessToken}`);
      } else {
        prom.config.headers = new axios.AxiosHeaders(
          Object.assign({}, prom.config.headers, {
            Authorization: `Bearer ${accessToken}`,
          }),
        );
      }
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    // console.log('response', error.response);
    if (error.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        }).then((updatedConfig) => {
          return axiosInstance(updatedConfig);
        });
      }
      originalConfig._retry = true;
      isRefreshing = true;
      return new Promise((resolve, reject) => {
        const body: ProcedureIO['refreshAccessToken']['input'] = {
          refreshToken: useStore.getState().refreshToken ?? '',
        };
        axios
          .post<SuperJSONResult>(
            'api/procedure/refresh-access-token',
            superjson.serialize(body),
          )
          .then(({ data }) => {
            // console.log('data', data);
            const {
              data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              },
            } =
              superjson.deserialize<
                Awaited<ProcedureIO['refreshAccessToken']['output']>
              >(data);
            // console.log('newAccessToken', newAccessToken);
            // console.log('newRefreshToken', newRefreshToken);
            //! https://zustand.docs.pmnd.rs/guides/event-handler-in-pre-react-18
            useStore.getState().updateAccessToken(newAccessToken);
            useStore.getState().updateRefreshToken(newRefreshToken);
            processQueue(null, newAccessToken);
            if (originalConfig.headers) {
              originalConfig.headers.Authorization = newAccessToken;
            }
            resolve(axiosInstance(originalConfig));
          })
          .catch((refreshError) => {
            if (refreshError?.status === 401) {
              useStore
                .getState()
                .updateAuthState({ status: 'LoggedOut', userId: undefined });
              useStore.getState().updateAccessToken(undefined);
              useStore.getState().updateRefreshToken(undefined);
            }
            processQueue(refreshError, null);
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
