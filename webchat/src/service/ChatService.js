import axiosService from '../config/axiosService';

export const getAllUser = (param) => axiosService.get(
    `${process.env.REACT_APP_API_ENDPOINT}/user?search=${param}`
);

export const selectChat = (userId) => axiosService.post(
    `${process.env.REACT_APP_API_ENDPOINT}/chat`, { userId }
);

export const getAllChat = () => axiosService.get(
    `${process.env.REACT_APP_API_ENDPOINT}/chat`
);

export const createGroupChat = (data) => axiosService.post(
    `${process.env.REACT_APP_API_ENDPOINT}/chat/group`, data
);

export const sendMessage = (formData) => axiosService.post(
    `${process.env.REACT_APP_API_ENDPOINT}/message`, formData, {
        headers: {
            'content-type': 'multipart/form-data'
        }
});

export const deleteMessage = (data) => axiosService.delete(
    `${process.env.REACT_APP_API_ENDPOINT}/message/delete`, data, null
);

export const getAllMessage = (id) => axiosService.get(
    `${process.env.REACT_APP_API_ENDPOINT}/message/${id}`
);

export const removeFromChat = (data) => axiosService.put(
    `${process.env.REACT_APP_API_ENDPOINT}/chat/groupremove`, data
);

export const renameChat = (data) => axiosService.put(
    `${process.env.REACT_APP_API_ENDPOINT}/chat/rename`, data
);

export const addUserGroup = (data) => axiosService.put(
    `${process.env.REACT_APP_API_ENDPOINT}/chat/groupadd`, data
);