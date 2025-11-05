import axios, { AxiosResponse } from 'axios'
import { ChannelType, IChannel } from '../Models/channels'
import { IUser, IUserAppColors, IUserFormValues } from '../Models/users'
import { IMediaFormValues, IMessage, IMessageFormValues } from '../Models/messages'

//axios.defaults.baseURL = 'http://localhost:5000/api'
//https://netchat-xv5f.onrender.com/api
//https://-xv5f.onrender.com/api

axios.defaults.baseURL = 'https://netchat-xv5f.onrender.com/api'
//interceptar la request antes de mandarla al back, en este caso para agregarle el token de authenticacion
axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('jwt');

  if(token) config.headers.Authorization = 'Bearer ' + token
  return config
}, (error) => Promise.reject(error))

const responseBody = (response: AxiosResponse) => response.data

const request = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postMedia: (url: string, media: IMediaFormValues) => {
    let formData = new FormData()
    formData.append('File', media.file)
    formData.append('ChannelId', media.channelId)
    formData.append('MessageType', '2')

    return axios.post(url, formData, {
      headers: {'Content-type': 'multipart/form-data' }
    }).then(responseBody)
  }
}

const Channels = {
  list: (channelType: ChannelType) : Promise<IChannel[]> => request.get(`/channels?ChannelType=${channelType}`),
  create: (channel: IChannel) => request.post('/channels', channel),
  detail: (channelId: string, message?: IMessage | null): Promise<IChannel> => request.put(`/channels/details/${channelId}`, message ?? {}),
  privateChannel: (channelId: string): Promise<IChannel> =>  request.get(`/channels/private/${channelId}`),
  update: (channel: IChannel) => request.put(`/channels/${channel.id}`, channel)
}

const User = {
  login: (user: IUserFormValues) : Promise<IUser> => request.post('/user/login', user),
  register: (user: IUserFormValues) : Promise<IUser> => request.post('/user/register', user),
  current: () : Promise<IUser> => request.get('/user'),
  list: (): Promise<IUser[]> => request.get('/user/list'),
  logout: (userId: string) : Promise<IUser> => request.get(`/user/logout/${userId}`),
  updateColors: (colors: IUserAppColors) => request.put(`/user/updateColors`, colors)
}

const Messages = {
  send: (message: IMessageFormValues) : Promise<IMessage> => request.post('/messages', message),
  sendMedia: (media: IMediaFormValues) : Promise<IMessage> => request.postMedia('/messages/upload', media)
}

export default {
  Channels,
  User,
  Messages
}