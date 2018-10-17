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
            case this.methods.head:
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
