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
                function (conf) {
                    eventHub.$emit('beforeRequest');
                    return conf;
                },
                function (error) {
                    eventHub.$emit('requestError', error);
                    return Promise.reject(error);
                }
            );
            myaxios.interceptors.response.use(
                function (response) {
                    eventHub.$emit('afterResponse');
                    return response;
                },
                function (error) {
                    eventHub.$emit('responseError', error);
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
    getPromise: function (lang, service) {
        var axiosInst = this.createAxios(lang, null)
        return axiosInst.get(service)
    },
    post: function (lang, service, content, auth, successCb, errorCb, eventhub) {
        var axiosInst = this.createAxios(lang, eventhub, null, auth)
        axiosInst.post(service, content).then(function (response) {
            console.log(response)
            successCb(response)
        }).catch(function (error) {
            console.log(error)
            errorCb(error)
        })
    },
    delete: function (lang, service, successCb, errorCb, eventhub) {
        var axiosInst = this.createAxios(lang, eventhub)
        axiosInst.delete(service).then(function (response) {
            console.log(response)
            successCb(response)
        }).catch(function (error) {
            console.log(error)
            errorCb(error)
        })
    }
}
