import axiosService from '../config/axiosService';

export const sendFriendRequest = (data) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/user/friendRequest`, data
);

export const getAllRequest = () => axiosService.get(
     `${process.env.REACT_APP_API_ENDPOINT}/user/friendRequest`
);

export const responseRequest = (data) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/user/response`, data
);

export const unfriend = (data) => axiosService.post(
     `${process.env.REACT_APP_API_ENDPOINT}/user/unfriend`, data
);
