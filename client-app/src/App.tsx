import React, { Component, useContext, useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import './App.css';
import { Button, Grid, Icon } from 'semantic-ui-react';
import SidePanel from './Components/SidePanel/SidePanel';
import ColorPanel from './Components/ColorPanel/ColorPanel';
import Messages from './Components/Messages/Messages';
import MetaPanel from './Components/MetaPanel/MetaPanel';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from './Stores/rootStore';
import { LoadingComponent } from './Components/LoadingComponent';
import Footer from './Footer';

const BREAKPOINT = 1327; 

const App = () =>{
  const rootStore = useContext(RootStoreContext)
  const { setAppLoaded, appLoaded, token } = rootStore.commonStore
  const { getUser, appUserColors } = rootStore.userStore
  const { createHubConnection, stopHubConnection } = rootStore.commonStore
  const { isChannelLoaded, channels } = rootStore.channelStore
  const { secundaryAppColor } = appUserColors
    // Inicializar según tamaño actual
  const [sidePanelVisible, setSidePanelVisible] = useState(window.innerWidth > BREAKPOINT);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= BREAKPOINT);

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

   // Detectar cambios de tamaño de ventana
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth <= BREAKPOINT;
        setIsMobile(mobile);
        setSidePanelVisible(!mobile); // se oculta automáticamente en pantallas chicas
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);


  if(!appLoaded) return <LoadingComponent content = "Loading app..." /> 
  return (
      <>
      {console.log('Render:', { isMobile, sidePanelVisible })}

      {/* Botón hamburguesa visible solo en móvil */}
      {isMobile && (
        <Button
          icon
          circular
          onClick={() => setSidePanelVisible((v) => !v)}
          style={{
            position: 'fixed',
            background: '#1b1c1d',
            top: 10,
            left: 10,
            zIndex: 3000,
            color: 'white',
          }}
        >
          <Icon name={sidePanelVisible ? 'close' : 'bars'}  />
        </Button>
      )}

      {/* En móvil lo renderizamos por fuera como overlay */}
      {isMobile && sidePanelVisible && (
        <>
          {/* Fondo oscuro para cerrar al clickear */}
          <div
            onClick={() => setSidePanelVisible(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 2400,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              width: '260px',
              background: secundaryAppColor,
              zIndex: 2500,
              boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease',
              transform: sidePanelVisible ? 'translateX(0)' : 'translateX(-100%)',
            }}
          >
            <SidePanel visible={sidePanelVisible} mobile={isMobile} />
          </div>
        </>
      )}

      {/* En escritorio va dentro del Grid */}
      <Grid columns="equal" className="app" style={{ background: secundaryAppColor, minHeight: '100vh',  height: '100vh', overflow: 'hidden',}}>
        {!isMobile && sidePanelVisible && (
          <Grid.Column width={3} style={{ padding: 0 }}>
            <SidePanel visible={sidePanelVisible} mobile={isMobile} />
          </Grid.Column>
        )}

        <Grid.Column
          width={!isMobile ? (sidePanelVisible ? 9 : 12) : 16}
          style={{
            padding: '0 10px 0 0',
            height: '100%',
            transition: 'width 0.3s ease',
          }}
        >
          {isChannelLoaded && channels.length > 0 && (
            <div style={{ height: 'calc(100% - 60px)' }}>
              <Messages />
            </div>
          )}
        </Grid.Column>
        {!isMobile &&(
        <Grid.Column width={4} style={{ padding: 0, height: '100%' }}>
          {isChannelLoaded && channels.length > 0 && <MetaPanel />}
        </Grid.Column>
        )}
        <Footer />
      </Grid>
    </>
  )
 }


export default observer(App);
