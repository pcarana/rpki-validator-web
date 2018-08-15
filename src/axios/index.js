/* eslint-disable */
import Axios from 'axios'
import config from '@/config'

export default {
    createAxios: function (lang, eventhub) {
        const myaxios = Axios.create();
        myaxios.defaults.headers.common['Accept-Language'] = lang ? lang : 'EN';
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
        var server = config.api.url
        axiosInst.get(server + service).then(function (response) {
            console.log(response)
            successCb(response)
        }).catch(function (error) {
            console.log(error)
            errorCb(error)
        })
    }
}
