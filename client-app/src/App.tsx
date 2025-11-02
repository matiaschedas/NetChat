import React, { Component, useContext, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import './App.css';
import { Grid } from 'semantic-ui-react';
import SidePanel from './Components/SidePanel/SidePanel';
import ColorPanel from './Components/ColorPanel/ColorPanel';
import Messages from './Components/Messages/Messages';
import MetaPanel from './Components/MetaPanel/MetaPanel';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from './Stores/rootStore';
import { LoadingComponent } from './Components/LoadingComponent';

const App = () =>{
  const rootStore = useContext(RootStoreContext)
  const { setAppLoaded, appLoaded, token } = rootStore.commonStore
  const { getUser, appUserColors } = rootStore.userStore
  const { createHubConnection, stopHubConnection } = rootStore.commonStore
  const { isChannelLoaded, channels } = rootStore.channelStore
  const { secundaryAppColor } = appUserColors
  useEffect(() => {
    createHubConnection()

    if(token){
      getUser().finally(() => setAppLoaded())
    } else{
      setAppLoaded()
    }

    return() => {
      //stopHubConnection()
    }
    
  },[getUser, setAppLoaded, token, appLoaded])

  if(!appLoaded) return <LoadingComponent content = "Loading app..." /> 
  return (
      
      <Grid columns="equal" className="app" style={{ background: secundaryAppColor }}>
        <>
        {console.log(secundaryAppColor)}
        <ColorPanel />
        <SidePanel />

        <Grid.Column className="column" style={{ marginLeft: 320 }}>
          { (isChannelLoaded && channels.length>0) && <Messages />}
        </Grid.Column>

        <Grid.Column width={4}>
          { (isChannelLoaded && channels.length>0) && <MetaPanel />}
        </Grid.Column>
        </>
      </Grid>
    )
 }


export default observer(App);
