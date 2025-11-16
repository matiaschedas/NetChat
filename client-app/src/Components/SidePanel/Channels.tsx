import React, { useEffect, useContext, useState } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels' 
import ChannelItem from './ChannelItem'
import ChannelForm from './ChannelForm'
import { RootStoreContext } from '../../Stores/rootStore'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { error } from 'console'

const Channels = () =>  {
    const rootStore = useContext(RootStoreContext);
    const channelStore = rootStore.channelStore
    const messageStore = rootStore.messageStore
    const commonStore = rootStore.commonStore
    const userStore = rootStore.userStore
    const { user } = userStore
    const {setSelectedChannelId, selectedChannelId, setSelectedChannelType, selectedChannelType} = commonStore
    const navigate = useNavigate();
    useEffect(() => {
      channelStore.loadChannels(ChannelType.Channel)
      console.log("se cargaron los canales")
    }, [channelStore])//solo necesitamos que nos traiga 1 vez los channels desde la api asi que le pasamos dependencias en vacio ([])

    useEffect(() => {
      channelStore.setNavigate(navigate)
    },[navigate, channelStore])

    const { channels, setActiveChannel, getCurrentChannel, channelNotification, cleanNotification} = channelStore
    const { loadMessages } = messageStore 
    
    const changeChannel = (channel: IChannel) => {
      setActiveChannel(channel)
      //console.log(getCurrentChannel())
      let currentChannelId = getCurrentChannel()?.id
      loadMessages(currentChannelId, null)
      setSelectedChannelId(currentChannelId)
      setSelectedChannelType(ChannelType.Channel)
      cleanNotification(currentChannelId)
    } 
    const displayChannels = (channels: IChannel[]) => {
      return (
        channels.length > 0 && 
        channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} getNotificationCount={getNotificationCount} changeChannel={changeChannel} active={selectedChannelId === channel.id && selectedChannelType === ChannelType.Channel}/>
        ))
      )
    }

    const getNotificationCount = (channel: IChannel) => {
      let count = 0
      console.log("notis: "+JSON.stringify(channelNotification, undefined ,2))
      channelNotification.forEach((notification) => {
        if(notification.id === channel.id && notification.sender.userName !== user?.userName){
          count = notification.newMessages
        }
      })
      if(count > 0) return count   
    }

    return (
      <React.Fragment>
        
        <Menu.Menu style={{ paddingBottom: '2em' }} >
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span> { }
            ({ channels.length }) <Icon name="add" onClick={() => channelStore.showModal(true)}/>
          </Menu.Item>

          {displayChannels(channels)}
        </Menu.Menu>

     

      </React.Fragment>

    )
}

export default observer(Channels)
