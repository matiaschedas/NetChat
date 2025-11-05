import React, { useContext, useEffect, useState } from 'react'
import { Button, Icon, Menu, Sidebar, SidebarPushable } from 'semantic-ui-react'
import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessages from './DirectMessages'
import { observer } from 'mobx-react-lite'
import Starred from './Starred'
import { RootStoreContext } from '../../Stores/rootStore'
import MetaPanel from '../MetaPanel/MetaPanel'

interface SidePanelProps {
  visible: boolean;
  mobile: boolean;
}

const MOBILE_BREAKPOINT = 1327;

const SidePanel = ({ visible, mobile }: SidePanelProps) => {
  const rootStore = useContext(RootStoreContext)
  const { isChannelLoaded, channels } = rootStore.channelStore
  const {appUserColors} = rootStore.userStore
  const { primaryAppColor } = appUserColors


/*
   // Notificar al padre cuando cambia la visibilidad
  useEffect(() => {
    onToggle?.(visible);
  }, [visible, onToggle]);*/

  return(
   <>
      <Sidebar
        as={Menu}
        animation="overlay"
        vertical
        inverted
        visible={visible}
        style={{
          width: 250,
          background: primaryAppColor,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        <Menu.Item style={{ background: primaryAppColor }}>
          <UserPanel />
        </Menu.Item>
        <Menu.Item style={{ background: primaryAppColor }}>
          <Starred />
        </Menu.Item>
        <Menu.Item style={{ background: primaryAppColor }}>
          <Channels />
        </Menu.Item>
        {isChannelLoaded && channels.length > 0 && (
          <Menu.Item style={{ background: primaryAppColor }}>
            <DirectMessages />
          </Menu.Item>
        )}

      {mobile && <div
            style={{
              margin: '1rem',
              padding: '0.8rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          > <MetaPanel /> </div>}
      </Sidebar>
    </>
  );
};

export default observer(SidePanel)