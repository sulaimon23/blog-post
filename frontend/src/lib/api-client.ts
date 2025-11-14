import { API_BASE_URL } from '@/constants';
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const config = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

                if (config._retry || !this.shouldRetry(error)) {
                    return Promise.reject(error);
                }

                config._retry = true;
                config._retryCount = (config._retryCount || 0) + 1;

                if (config._retryCount > MAX_RETRIES) {
                    return Promise.reject(error);
                }

                await this.delay(RETRY_DELAY * config._retryCount);

                return this.client(config);
            }
        );
    }

    private shouldRetry(error: AxiosError): boolean {
        if (!error.response) {
            return true;
        }

        const status = error.response.status;
        return status >= 500 || status === 400;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();
