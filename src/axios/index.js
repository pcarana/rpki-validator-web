/* eslint-disable */
import Axios from 'axios'
import config from '@/config'

export default {
    methods: {
        get: 'get',
        post: 'post',
        delete: 'delete'
    },
    createAxios: function (lang, auth) {
        const myaxios = Axios.create();
        myaxios.defaults.headers.common['Accept-Language'] = lang ? lang : 'EN';
        myaxios.defaults.baseURL = config.api.url;
        if (auth) {
            myaxios.defaults.auth = auth;
        }
        return myaxios;
    },
    getPromise: function (method, lang, service, auth) {
        return this.getPromise(method, lang, service, auth, null)
    },
    getPromise: function (method, lang, service, auth, data) {
        var axiosInst = this.createAxios(lang, auth)
        switch (method) {
            case this.methods.get:
                return axiosInst.get(service)
            case this.methods.post:
                return axiosInst.post(service, data)
            case this.methods.delete:
                return axiosInst.delete(service)
            default:
                return Promise.reject(new Error('Method not supported - ' + method))
        }
    },
    getAsPromise: function (lang, service, auth) {
        var axiosInst = this.createAxios(lang, auth)
        return axiosInst.get(service)
    },
    get: function (lang, service, auth, successCb, errorCb) {
        this.get(lang, service, auth, successCb, errorCb, null)
    },
    get: function (lang, service, auth, successCb, errorCb, finallyCb) {
        let promise = this.getAsPromise(lang, service, auth)
        this.processPromise(promise, successCb, errorCb, finallyCb)
    },
    post: function (lang, service, content, auth, successCb, errorCb) {
        this.post(lang, service, content, auth, successCb, errorCb, null)
    },
    post: function (lang, service, content, auth, successCb, errorCb, finallyCb) {
        var axiosInst = this.createAxios(lang, auth)
        let promise = axiosInst.post(service, content)
        this.processPromise(promise, successCb, errorCb, finallyCb)
    },
    delete: function (lang, service, auth, successCb, errorCb) {
        this.delete(lang, service, auth, successCb, errorCb, null)
    },
    delete: function (lang, service, auth, successCb, errorCb, finallyCb) {
        var axiosInst = this.createAxios(lang, auth)
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
            console.log(error)
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
