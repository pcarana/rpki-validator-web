/* eslint-disable */
import Axios from 'axios'
import config from '@/config'

export default {
    createAxios: function (lang) {
        return this.createAxios(lang, null, null);
    },
    createAxios: function (lang, data, auth) {
        const myaxios = Axios.create();
        myaxios.defaults.headers.common['Accept-Language'] = lang ? lang : 'EN';
        myaxios.defaults.baseURL = config.api.url;
        myaxios.defaults.data = data;
        if (auth != null) {
            myaxios.defaults.auth = auth;
            myaxios.defaults.withCredentials = true;
        }
        return myaxios;
    },
    getAsPromise: function (lang, service) {
        var axiosInst = this.createAxios(lang)
        return axiosInst.get(service)
    },
    get: function (lang, service, successCb, errorCb) {
        this.get(lang, service, successCb, errorCb, null)
    },
    get: function (lang, service, successCb, errorCb, finallyCb) {
        let promise = this.getAsPromise(lang, service)
        this.processPromise(promise, successCb, errorCb, finallyCb)
    },
    post: function (lang, service, content, successCb, errorCb) {
        this.post(lang, service, content, successCb, errorCb, null)
    },
    post: function (lang, service, content, successCb, errorCb, finallyCb) {
        var axiosInst = this.createAxios(lang)
        let promise = axiosInst.post(service, content)
        this.processPromise(promise, successCb, errorCb, finallyCb)
    },
    delete: function (lang, service, successCb, errorCb) {
        this.delete(lang, service, successCb, errorCb, null)
    },
    delete: function (lang, service, successCb, errorCb, finallyCb) {
        var axiosInst = this.createAxios(lang)
        let promise = axiosInst.delete(service)
        this.processPromise(promise, successCb, errorCb, finallyCb)
    },
    processPromise: function (promise, thenCb, errorCb, finallyCb) {
        if (!promise) {
            return
        }
        promise.then(function (response) {
            if (thenCb) {
                thenCb(response)
            }
        }).catch(function (error) {
            if (errorCb) {
                errorCb(error)
            }
        }).finally(function () {
            if (finallyCb) {
                finallyCb()
            }
        })
    }
}
