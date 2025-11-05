import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { error } from "console";
import { makeObservable, observable, action, runInAction } from "mobx";
import { ChannelType } from "../Models/channels";
import { IMessage, ITypingNotification } from "../Models/messages";
import { IUser } from "../Models/users";
import { RootStore } from "./rootStore";
import axios, { AxiosError, HttpStatusCode } from "axios"

export default class CommonStore{
  rootStore: RootStore
  @observable token: string | null = window.localStorage.getItem('jwt')
  @observable appLoaded = false
  @observable.ref hubConnection: HubConnection | null = null
  @observable selectedChannelId: string | null = null
  @observable selectedChannelType: ChannelType | null = null
  
  constructor(rootStore: RootStore) {
    makeObservable(this)
    this.rootStore = rootStore;
    
  }
  
  @action setSelectedChannelId = (id: string) => {
    this.selectedChannelId = id
  }

  @action setSelectedChannelType = (type: ChannelType) => {
    this.selectedChannelType = type
  }

  @action setAppLoaded = () => {
    this.appLoaded = true
  }


  @action setToken = (token: string | null) => {
    window.localStorage.setItem('jwt', token!)
    this.token = token
  }

  @action.bound restartHubConnection = async () => {
    await this.stopHubConnection()
  
    await this.createHubConnection(); // Crear nueva conexión
  
  }
 //https://netchat-xv5f.onrender.com/chat
 //http://localhost:5000/chat
  @action createHubConnection = async () => {
    if(this.hubConnection) return;
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('https://netchat-xv5f.onrender.com/chat', {
      accessTokenFactory: () => this.rootStore.commonStore.token!
    })
    .configureLogging(LogLevel.Information)
    .build()

    //this.hubConnection.start().catch((error) => console.log("Error establishing connection", error))

    this.hubConnection.on('ReceiveMessage', (message: IMessage) => {
      runInAction(() => {/*
       // this.messages.push(message)
        this.rootStore.messageStore.messages = [...this.rootStore.messageStore.messages, message]
        this.rootStore.channelStore.addNotification(message.channelId, message)*/

        function parseUTC(date: string | Date) {
            if (date instanceof Date) return date;
            // Crea un Date usando la fecha UTC exacta, sin convertir a local
            const d = new Date(date);
            return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
        }
       if (!message.createdAt) return; // ignorar mensajes sin fecha

    // Normalizar el mensaje entrante
        const normalized: IMessage = {
          ...message,
          createdAt: parseUTC(message.createdAt)
        };
    // Normalizar todos los mensajes existentes
       const messages = this.rootStore.messageStore.messages.map(m => ({
          ...m,
          createdAt: m.createdAt instanceof Date 
            ? m.createdAt 
            : new Date(m.createdAt)
        }));
    // Agregar el mensaje nuevo
    messages.push(normalized);

    // Ordenar por fecha
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Actualizar MobX
    this.rootStore.messageStore.messages = messages;

    // Notificación
    this.rootStore.channelStore.addNotification(message.channelId, message);
    });
  });
    this.hubConnection.on('UserLogged', (user: IUser) => {
      runInAction(() => {
        const index = this.rootStore.userStore.users.findIndex(u => u.id === user.id)
        if(index !== -1){
          this.rootStore.userStore.users[index] = {
            ...this.rootStore.userStore.users[index],
            isOnline: true
          };
        }
      })
    })
    this.hubConnection.on('UserLogout', (user: IUser) => {
      runInAction(() => {
        const index = this.rootStore.userStore.users.findIndex(u => u.id === user.id)
        if(index !== -1){
          this.rootStore.userStore.users[index] = {
            ...this.rootStore.userStore.users[index],
            isOnline: false
          }
        }
      })
    })

    this.hubConnection.on('UserStartTyping', (typing: ITypingNotification) => {
      runInAction(() => {
        const index = this.rootStore.messageStore.typingsNotifications.findIndex(t => t.channelId === typing.channelId && t.sender.userName === typing.sender.userName)
        if (index !== -1) return 
        this.rootStore.messageStore.typingsNotifications.push(typing)
      })
    })

     this.hubConnection.on('UserStopTyping', (typing: ITypingNotification) => {
      runInAction(() => {
        const index = this.rootStore.messageStore.typingsNotifications.findIndex(t => t.channelId === typing.channelId && t.sender.userName === typing.sender.userName)
        if(index !== -1) this.rootStore.messageStore.typingsNotifications.splice(index, 1)
        return 
      })
    })


    await this.hubConnection.start()
    console.log('SignalR connection established')
  }

  @action stopHubConnection = async () => {
    if(this.hubConnection){
      try{
        await this.hubConnection.stop()
        console.log('SignalR conection stopped')
      } catch (error){
        console.log('Error stopping SignalR connection', error)
      } finally {
        this.hubConnection = null
      }
    }
  }
}