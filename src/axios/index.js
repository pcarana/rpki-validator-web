/* eslint-disable */
import Axios from 'axios'
import config from '@/config'

export default {
    methods: {
        get: 'get',
        head: 'head',
        post: 'post',
        delete: 'delete'
    },
    createAxios: function (lang) {
        const myaxios = Axios.create();
        myaxios.defaults.headers.common['Accept-Language'] = lang ? lang : 'EN';
        myaxios.defaults.baseURL = config.api.url;
        return myaxios;
    },
    setBasicAuth(axios, auth) {
        axios.defaults.auth = auth
    },
    setToken(axios, useToken) {
        if (useToken && localStorage.getItem('t')) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('t')
        }
    },
    getPromise: function (method, lang, service, useToken) {
        return this.getPromise(method, lang, service, useToken, null)
    },
    getPromise: function (method, lang, service, useToken, data) {
        var axiosInst = this.createAxios(lang)
        this.setToken(axiosInst, useToken)
        switch (method) {
            case this.methods.get:
                if (data) {
                    return axiosInst.get(service, {params: data})
                }
                return axiosInst.get(service)
            case this.methods.head:
                if (data) {
                    return axiosInst.head(service, {params: data})
                }
                return axiosInst.head(service)
            case this.methods.post:
                return axiosInst.post(service, data)
            case this.methods.delete:
                return axiosInst.delete(service)
            default:
                return Promise.reject(new Error('Method not supported - ' + method))
        }
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
