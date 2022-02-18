import axios, { AxiosRequestConfig } from "axios";
import { IHttpClient, IHttpClientRequestParameters } from "./interfaces/httpclient";

class HttpClient implements IHttpClient {
    async post<T = any, D = any>(parameters: IHttpClientRequestParameters<D>): Promise<T> {
        const { url, payload, headers } = parameters
        const options: AxiosRequestConfig = {
            headers: headers
        }

        try {
            return await axios.post(url, payload, options);
        } catch (e) {
            throw e.response.data
        }
    }
}
const httpClient =  new HttpClient();
export default httpClient;