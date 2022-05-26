import axios, { AxiosRequestConfig } from "axios";
import { IHttpClient, IHttpClientRequestParameters } from "./interfaces/httpclient";

class HttpClient implements IHttpClient {
    async get<T = any, D = any>(parameters: IHttpClientRequestParameters<D>): Promise<T> {
        const { url, payload, headers } = parameters
        const options: AxiosRequestConfig = {
            headers: headers,
            params: payload
        }

        return axios.get(url, options);
    }

    async post<T = any, D = any>(parameters: IHttpClientRequestParameters<D>): Promise<T> {
        const { url, payload, headers } = parameters
        const options: AxiosRequestConfig = {
            headers: headers
        }

        return axios.post(url, payload, options);
    }
}
const httpClient = new HttpClient();
export default httpClient;
