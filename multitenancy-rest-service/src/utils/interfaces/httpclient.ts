export interface IHttpClient {
    get<T=any, D=any>(parameters: IHttpClientRequestParameters<D>): Promise<T>
    post<T=any, D=any>(parameters: IHttpClientRequestParameters<D>): Promise<T>
}

export interface IHttpClientRequestParameters<D> {
    url: string
    payload?: D
    headers?: Record<string, string | number | boolean>
}
