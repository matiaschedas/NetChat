import { computed, observable, action, makeObservable, runInAction } from "mobx";
import agent from "../Api/agent";
import { IUser, IUserAppColors, IUserFormValues } from "../Models/users";
import { RootStore } from "./rootStore";
import md5 from 'md5';
import { HubConnection } from "@aspnet/signalr";
import axios, { AxiosError, HttpStatusCode } from "axios"

export default class UserStore {
  @observable user: IUser | null = null
  rootStore: RootStore
  @observable navigate: ((path: string) => void) | null = null
  @observable users: IUser[] = []
  @observable.ref hubConnection: HubConnection | null = null
  @observable appUserColors : IUserAppColors = {
    primaryAppColor: '#4c3c4c',
    secundaryAppColor: '#eee'
  }

  constructor(rootStore: RootStore)
  {
    makeObservable(this)
    this.rootStore = rootStore
  }

  @computed get IsLoggedIn() {
    console.log("logeado: "+!!this.user)
    return !!this.user
  }

  @action setNavigate = (navigateFn: (path: string) => void) => {
    this.navigate = navigateFn
  }
  @action login = async (values: IUserFormValues) => {
    try
    {
      /*const connection = this.rootStore.commonStore.hubConnection;
      if (!connection) throw new Error("Hub connection is not established");
      await connection.invoke('Login', values);*/
      var user = await agent.User.login(values)
      console.log("EL USUARIO LOGEO: "+JSON.stringify(user, undefined , 2))
      debugger;
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token)
      })
      await this.rootStore.commonStore.restartHubConnection();
      const connection = this.rootStore.commonStore.hubConnection
      if (!connection) throw new Error("Hub connection is not established userStore")
      this.navigate?.("/");
      await connection.invoke('Login', values)
    }
    catch(err) 
    {
      console.log("error en login")
      console.log(err)
      throw err
    }
  }
  @action logout = async (id: string) => {
    try{
      await agent.User.logout(id)
      const connection = this.rootStore.commonStore.hubConnection
       if (connection) {
        try {
          await connection.invoke('Logout', id);
        } catch (err) {
          console.log('Error invoking logout on hub', err);
        }
      }
      await this.rootStore.commonStore.stopHubConnection();

      runInAction(() => {
        this.rootStore.commonStore.setToken(null)
        this.user = null
        window.localStorage.removeItem('jwt');
        this.navigate?.("/login");
      });
    }
    catch(err){
      console.log("error en logout")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          console.log('Ocurrió un error inesperado');
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
  @action register = async (values: IUserFormValues) => {
    try{
      values.avatar = `http://gravatar.com/avatar/${md5(values.email)}?d=identicon`
      var user = await agent.User.register(values)
      runInAction(() => {
        this.user = user
        this.navigate?.("/");
        this.rootStore.commonStore.setToken(user.token)
      });
    }
    catch(err){
      console.log("error en register")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          console.log('Ocurrió un error inesperado');
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
  @action setCurrentUser = async() => {
    try{
      var user = await agent.User.current()
      runInAction(() => {
        this.user = user
        console.log("se ejecuto setCurrentUser")
      });
    }
    catch(err){
      console.log("error en setCurrentUser")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          console.log('Ocurrió un error inesperado');
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
  @action getCurrentUser = () => {
    console.log("se ejecuto getCurrentUser")
    return this.user
  }
  @action getUser = async () => {
    try {
      const user = await agent.User.current()
      runInAction(() => {
        this.user = user
      })
    }
    catch(err){
      console.log("error en getUser")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          console.log('Ocurrió un error inesperado');
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
  @action loadUsers = async () => {
    try{
      const users = await agent.User.list()
      runInAction(() => {
        this.users = users
      });
    }
    catch(err){
      console.log("error en loadUsers")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          console.log('Ocurrió un error inesperado');
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
  @action SaveAppColors = async (colors: IUserAppColors) => {
    try{
      const user = await agent.User.updateColors(colors)
      runInAction(() => {
        this.user = user
        user.primaryAppColor = colors.primaryAppColor
        user.secundaryAppDolor = colors.secundaryAppColor
      })
    }
    catch(err){
      console.log("error en loadUsers")
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          console.log('Ocurrió un error inesperado');
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
  @action SetAppColor = (colors: IUserAppColors) => {
    this.appUserColors = colors
  }

}
