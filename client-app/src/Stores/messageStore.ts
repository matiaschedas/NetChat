import { observable, action, runInAction, makeObservable } from "mobx";
import agent from "../Api/agent";
import { IMediaFormValues, IMessage, IMessageFormValues, ITypingNotification } from "../Models/messages";
import { RootStore } from "./rootStore";
import { HubConnection } from '@aspnet/signalr'
import { HubConnectionBuilder } from "@aspnet/signalr/dist/esm/HubConnectionBuilder";
import { LogLevel } from "@aspnet/signalr/dist/esm/ILogger";
import { SearchResults } from "semantic-ui-react";
import axios, { AxiosError, HttpStatusCode } from "axios"

export default class MessageStore
{
  @observable messages: IMessage[] = []
  rootStore: RootStore
  @observable isModalVisible: boolean = false
  @observable isImageModelVisble: boolean = false
  @observable imageSelected: string | null = null
  @observable userPosts: { [name: string] : { avatar: string, count: number}} | null = null
  @observable typingsNotifications: ITypingNotification[] = []
  @observable noMorePreviousMessages: boolean = false

  constructor(rootStore: RootStore  ) {
    makeObservable(this)
    this.rootStore = rootStore
    
  }

  @action setNoMorePreviousMessages = (state: boolean) => {
    this.noMorePreviousMessages = state
  }

  @action startTyping = async (typing: ITypingNotification) => 
  {
    try{
      await this.rootStore.commonStore.hubConnection?.invoke('StartTyping', typing)
    }catch (error){
      throw error
    }
  }

  @action stopTyping = async (typing: ITypingNotification) => {
    try{
      await this.rootStore.commonStore.hubConnection?.invoke("StopTyping", typing)
    }catch (error){
      throw error
    }
  }
  

  @action sendMessage = async (message: IMessageFormValues) => 
  {
    try {
      await this.rootStore.commonStore.hubConnection?.invoke('SendMessage', message)
      //const result = await agent.Messages.send(message) //con endpoint (ahora se usa SignalR)

      /*runInAction(() => {
        //this.messages.push(result)
        this.messages = [...this.messages, result] //esto dispara los useEffect porque se crea un nuevo array cada vez, de la otra forma se actualiza el mismo array y los useeffect no lo detectan como un cambio en la dependencia messages
        //console.log(`se cargo el mensaje: ${JSON.stringify(result, undefined, 2)}`)
      })*/ //(ahora se usa SignalR)
    }
    catch(error) {
      throw error
    }
  }

  @action appendPreviousMessages = async (channelId: string, message : IMessage | null) => {
    try{
      if(channelId !== undefined){
        await new Promise((resolve) => setTimeout(resolve, 1000)); //simula cargando
        const results = await this.rootStore.channelStore.detail(channelId, message)
        runInAction(() => {
          const existingMessages = new Set(this.messages.map(m => m.id))
          const newMessages = ((results.messages ?? []) as IMessage[]).filter(m => !existingMessages.has(m.id));
          this.messages = [...this.messages, ...(newMessages ?? [])] 
          if(newMessages.length === 0){
            this.noMorePreviousMessages = true
            console.log("ya no hay mensajes mas antiguos")
          }
          else{
            this.noMorePreviousMessages = false
            console.log("se sumaron mensajes mas antiguos")
          }
          this.countUserPosts(this.messages)
        })
      }
    }catch(error){
      throw error
    }
  }
  @action loadMessages = async (channelId: string, message: IMessage | null) => {
    try{
      this.messages = []
      if(channelId !== undefined){
        const result = await this.rootStore.channelStore.detail(channelId, message)
        
        runInAction(() => {
          this.messages = result.messages ?? []
          console.log("se cargaron los mensajes")
          this.countUserPosts(result.messages)
        });
      }
    }
    catch(error){
      throw error
    }
  }
  @action uploadImage = async (values: IMediaFormValues) => {
    try{
      /*const result = */await agent.Messages.sendMedia(values)
      /* innecesario con signalr:
      runInAction(() => {
        this.messages = [...this.messages, result]
       //console.log(`se cargo el mensaje: ${JSON.stringify(result, undefined, 2)}`)
      });*/
    }
    catch(error){
      throw error
    }
  }
  @action showModal = (show: boolean) => {
    this.isModalVisible = show
  }
  @action showImageModal = (show: boolean) => {
    this.isImageModelVisble = show
  }
  @action setImageSelected = (imageUrl : string) => {
    this.imageSelected = imageUrl
  }
  @action countUserPosts = (messages: IMessage[] | undefined) => {
    let userPosts = messages?.reduce((acc: any, message) => {
      if(message.sender.userName in acc) {
        acc[message.sender.userName].count += 1
      } else{
        acc[message.sender.userName] = {
          avatar: message.sender.avatar,
          count: 1
        }
      }
      return acc
    }, {});
    this.userPosts = userPosts
  }
}