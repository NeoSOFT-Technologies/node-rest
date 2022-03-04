import axios, { AxiosRequestConfig } from "axios";
import { IHttpClient, IHttpClientRequestParameters } from "./interfaces/httpclient";

class HttpClient implements IHttpClient {
    async get<T = any, D = any>(parameters: IHttpClientRequestParameters<D>): Promise<T> {
        const { url, payload, headers } = parameters
        const options: AxiosRequestConfig = {
            headers: headers,
            params: payload
        }

        try {
            return await axios.get(url, options);
        } catch (e) {
            throw e
        }
    }

    async post<T = any, D = any>(parameters: IHttpClientRequestParameters<D>): Promise<T> {
        const { url, payload, headers } = parameters
        const options: AxiosRequestConfig = {
            headers: headers
        }

        try {
            return await axios.post(url, payload, options);
        } catch (e) {
            throw e
        }
    }
}
const httpClient = new HttpClient();
export default httpClient;