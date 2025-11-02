import { channel } from 'diagnostics_channel'
import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels'
import { RootStoreContext } from '../../Stores/rootStore'
import ChannelItem from './ChannelItem'

const Starred = () => {
  const rootStore = useContext(RootStoreContext)
  const { starredChannels, setActiveChannel, getCurrentChannel, loadChannels } = rootStore.channelStore
  const { loadMessages } = rootStore.messageStore
  const commonStore = rootStore.commonStore
  const {setSelectedChannelId, selectedChannelId, setSelectedChannelType, selectedChannelType} = commonStore

   const changeChannel = (channel: IChannel) => {
      setActiveChannel(channel)
      //console.log(getCurrentChannel())
      let currentChannelId = getCurrentChannel()?.id
      loadMessages(currentChannelId, null)
      setSelectedChannelId(currentChannelId)
      setSelectedChannelType(ChannelType.Starred)
    } 

    useEffect(() => {
      loadChannels(ChannelType.Starred)
    },[loadChannels])

  const displayChannels = (channels: IChannel[]) => {
     if(channels.length > 0)  return channels.map((channel) => (
      <ChannelItem key={channel.id} channel={channel} getNotificationCount={() => undefined} changeChannel={changeChannel} active={selectedChannelId === channel.id && selectedChannelType === ChannelType.Starred}/>
    ))
    return null
  }  

  return (
    <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
            <Menu.Item>
              <span>
                <Icon name="exchange"/> STARRED
              </span> {' '}
              ({starredChannels.length}){' '}
            </Menu.Item>
        {displayChannels(starredChannels)}
        </Menu.Menu>
    </React.Fragment>
  )
}

export default observer(Starred)
