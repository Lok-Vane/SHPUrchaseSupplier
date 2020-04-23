import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DaoService {
    constructor(private http: HttpClient) { }

    /**
     * Post请求
     * @param apiName Api接口地址
     * @param data 数据
     */
    doPostRequest(apiUrl: string, data?: any, option?: any) {
        if (data && option) {
            return this.http.post(apiUrl, data, option);
        } else if (data) {
            return this.http.post(apiUrl, data);
        } else if (option) {
            return this.http.post(apiUrl, {}, option);
        } else {
            return this.http.post(apiUrl, {});
        }
    }

    /**
     * Get请求
     * @param apiUrl Api接口地址
     */
    doGetRequest(apiUrl: string) {
        return this.http.get(apiUrl);
    }

    /**
     * Put请求
     * @param apiUrl Api接口地址
     * @param data 数据
     */
    doPutRequest(apiUrl: string, data: any) {
        return this.http.put(apiUrl, data);
    }

    /**
     * Patch请求
     * @param apiUrl Api接口地址
     * @param data 数据
     */
    doPatchRequest(apiUrl: string, data: any) {
        return this.http.patch(apiUrl, data);
    }

    /**
     * Delete请求
     * @param apiUrl Api接口地址
     * @param data 数据
     */
    doDeleteRequest(apiUrl: string, data: any) {
        return this.http.delete(apiUrl, data);
    }
}
