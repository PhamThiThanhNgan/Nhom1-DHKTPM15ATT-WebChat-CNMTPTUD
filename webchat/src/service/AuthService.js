import axiosService from '../config/axiosService';
import _ from 'lodash';

export const register = (formData) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/auth/register`, formData, null
);

export const login = (formData) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/auth/login`, formData, null
);

export const forgotPassword = (formData) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/auth/forgot-password`, formData, null
);

export const recoveryPassword = (formData, id, token) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/auth/reset-password/${id}/${token}`, formData, null
);

export const getMe = () => axiosService.get(`${process.env.REACT_APP_API_ENDPOINT}/auth/me`);

export const updateImage = (formData) => axiosService.put(
    `${process.env.REACT_APP_API_ENDPOINT}/auth/user-image`, formData, {
        headers: {
            'content-type': 'multipart/form-data'
        }
});

export const updateName = (formData) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/auth/user-name`, formData, null
);


export const isLogin = () => {
     const accessToken = window.localStorage.getItem('accessToken');

     return !_.isEmpty(accessToken);
};

export const saveToken = (token) => { window.localStorage.setItem('accessToken', token) };

export const getAccessToken = () => {
     const token = window.localStorage.getItem('accessToken')
     return token;
};
