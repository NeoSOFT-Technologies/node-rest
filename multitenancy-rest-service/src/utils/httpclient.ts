import axios, { AxiosRequestConfig } from "axios";
import { IHttpClient, IHttpClientRequestParameters } from "./interfaces/httpclient";

export class HttpClient implements IHttpClient {
    async post<T = any, D = any>(parameters: IHttpClientRequestParameters<D>): Promise<T> {
        const { url, payload, headers } = parameters
        const options: AxiosRequestConfig = {
            headers: headers
        }

        try {
            // console.log('url: ',url);
            // console.log('payload: ',payload);
            // console.log('headers: ',headers);
            
            return await axios.post(url, payload, options);
        } catch (e) {
            console.log('inside error:',e.response.data);
            
            throw e.response.data
        }
    }
}