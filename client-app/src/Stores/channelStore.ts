import axios, { AxiosError, HttpStatusCode } from "axios"
import { action, observable, makeObservable, runInAction, computed, toJS} from "mobx"
import agent from "../Api/agent"
import { ChannelType, IChannel, IChannelNotification } from "../Models/channels"
import { toast } from 'react-toastify'
import { RootStore } from "./rootStore"
import { Channel, channel } from "diagnostics_channel"
import { getEffectiveTypeParameterDeclarations } from "typescript"
import { IMessage } from "../Models/messages"


export default class ChannelStore {
  @observable channels: IChannel[] = []
  @observable isModalVisible: boolean = false
  @observable errorStatus: number | null = null
  @observable errorMessage: string = ''
  @observable navigate: ((path: string) => void) | null = null
  rootStore: RootStore
  @observable activeChannel: IChannel | null = null
  @observable isChannelLoaded: boolean = false
  @observable starredChannels: IChannel[] = []
  @observable channelNotification: IChannelNotification[] = []
  
  constructor(rootStore: RootStore){
    makeObservable(this)
    this.rootStore = rootStore
  }

  @action setChannelStarred = async (channel: IChannel) => {
    try{
      channel.channelType = channel.channelType !== ChannelType.Starred ? ChannelType.Starred : ChannelType.Channel
      await agent.Channels.update(channel)
      await this.loadChannels(ChannelType.Channel)
      await this.loadChannels(ChannelType.Starred)
    } catch(err){
      console.log(err)
      console.log("error en setChannelStarred")
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===401)
      {
        this.navigate?.('/login')
      }
      else throw err
    }
  }
  
  @action setNavigate = (navigateFn: (path: string) => void) => {
    this.navigate = navigateFn
  }
  @action loadChannels = async (channelType: ChannelType) => {
    try{
      var response = await agent.Channels.list(channelType)
      if(channelType === ChannelType.Channel && response.length > 0){
        await this.rootStore.messageStore.loadMessages(response[0].id, null)
      }
      runInAction(() => {
        var channelsFromResponse = response.filter(c => c.channelType === channelType)
        this.isChannelLoaded = false
        if(channelType !== ChannelType.Starred){
          this.channels = channelsFromResponse
        }
        else{
          this.starredChannels = channelsFromResponse
        }
        this.isChannelLoaded = true
      });
      
    }
    catch(err){
      console.log("error en loadChannels")
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===404)
      {
        runInAction(() => {
          this.setError(404, 'Error al cargar canales');
          this.navigate?.('/notfound');
          this.clearError();
        });
      }
      if(axiosError.response?.status===500)
      {
        runInAction(() => {
            this.setError(500, 'Error al crear canal');
            toast.error('Server error');
            this.clearError();
        });
      }
      if(axiosError.message === 'Network Error' && !axiosError.response)
      {
        runInAction(() => {
            toast.error('Network Error - Make sure API is running');
        });
      }
      if(axiosError.response?.status===401)
      {
          this.navigate?.('/login')
      }
      else throw err
    }
    
  }
  @action showModal = (show: boolean) => {
    this.isModalVisible = show
  }
  @action setActiveChannel = (channel: IChannel) => {
    this.activeChannel = channel
    this.rootStore.messageStore.noMorePreviousMessages = false
  } 
  @action getCurrentChannel = () => {
    if(this.activeChannel !== null ) return toJS(this.activeChannel)
    this.activeChannel = this.channels[0]
    return toJS(this.activeChannel)
  }
  @action createChannel = async (channel: IChannel) => {
    try{
      await agent.Channels.create(channel)
      runInAction(() => this.channels.push(channel))
    }
    catch(err){
      console.log("error en createChannel")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===404)
      {
        runInAction(() => {
          this.setError(404, 'Error al cargar canales');
          this.navigate?.('/notfound');
          this.clearError();
        });
      }
      if(axiosError.response?.status===500)
      {
        runInAction(() => {
            this.setError(500, 'Error al crear canal');
            toast.error('Server error');
            this.clearError();
        });
      }
      if(axiosError.message === 'Network Error' && !axiosError.response)
      {
        runInAction(() => {
            toast.error('Network Error - Make sure API is running');
        });
      }
      if(axiosError.response?.status===401) 
      { 
        this.navigate?.('/login');
      }
      else throw err
    }
  }
  @action detail = async (channelId: string, message: IMessage | null) : Promise<IChannel> => {
    try{
      return await agent.Channels.detail(channelId, message)
    }
    catch (err){
      console.log("error en detail")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===401)
      {
        this.navigate?.('/login')
      }
      else throw err
      return Promise.reject(err)
    }
  }
  @action setError = (status: number, message: string) => {
    this.errorStatus = status
    this.errorMessage = message
  }
  @action clearError = () => {
    this.errorStatus = null
    this.errorMessage = ''
  }
  @action changePrivateChannel = async (userId: string) => {
    try{
      let currentChannel = await agent.Channels.privateChannel(userId)
      runInAction(() => {
        this.setActiveChannel(currentChannel)
        this.rootStore.messageStore.noMorePreviousMessages = false
      });
    }
    catch(err){
      console.log("error en changePrivateChannel")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===401)
      {
        this.navigate?.('/login')
      }
      else throw err
    }
  }
  @action addNotification = (channelId: string, message: IMessage) => {
    let notification = this.channelNotification.filter((x) => x.id === channelId)
    if(notification.length === 0){
      this.channelNotification.push({
        id: channelId,
        newMessages: 1,
        sender: message.sender
      })
      return 
    }
    console.log("notificacion: "+JSON.stringify(this.channelNotification, undefined, 2))
    notification[0].newMessages = notification[0].newMessages + 1;
  } 
  @action cleanNotification = (channelId: string) => {
    let notification = this.channelNotification.filter((x) => x.id === channelId)
    if (notification.length !== 0) {
      notification[0].newMessages = 0
    }
  }
}

