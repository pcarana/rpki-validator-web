/* eslint-disable */
import Axios from 'axios'
import config from '@/config'

export default {
    createAxios: function (lang, eventhub) {
        return this.createAxios(lang, event, null, null);
    },
    createAxios: function (lang, eventhub, data, auth) {
        const myaxios = Axios.create();
        myaxios.defaults.headers.common['Accept-Language'] = lang ? lang : 'EN';
        myaxios.defaults.baseURL = config.api.url;
        myaxios.defaults.data = data;
        if (auth != null) {
            myaxios.defaults.auth = auth;
            myaxios.defaults.withCredentials = true;
        }
        if (eventhub) {
            myaxios.interceptors.request.use(
                conf => {
                    eventHub.$emit('before-request');
                    return conf;
                },
                error => {
                    eventHub.$emit('request-error');
                    return Promise.reject(error);
                }
            );
            myaxios.interceptors.response.use(
                response => {
                    eventHub.$emit('after-response');
                    return response;
                },
                error => {
                    eventHub.$emit('response-error');
                    return Promise.reject(error);
                }
            );
        }
        return myaxios;
    },
    get: function (lang, service, successCb, errorCb) {
        this.get(lang, service, successCb, errorCb, null)
    },
    get: function (lang, service, successCb, errorCb, eventhub) {
        var axiosInst = this.createAxios(lang, eventhub)
        axiosInst.get(service).then(function (response) {
            console.log(response)
            successCb(response)
        }).catch(function (error) {
            console.log(error)
            errorCb(error)
        })
    },
    post: function (lang, service, auth, successCb, errorCb, eventhub) {
        var axiosInst = this.createAxios(lang, eventhub, null, auth)
        axiosInst.post(service).then(function (response) {
            console.log(response)
            successCb(response)
        }).catch(function (error) {
            console.log(error)
            errorCb(error)
        })
    }
}
