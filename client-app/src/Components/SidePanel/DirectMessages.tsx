import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Icon, Loader, Menu } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels';
import { IUser } from '../../Models/users';
import { RootStoreContext } from '../../Stores/rootStore';
import DirectMessagesItem from './DirectMessageslItem'

const DirectMessages = () => {
  const rootStore = useContext(RootStoreContext);
  const channelStore = rootStore.channelStore
  const messageStore = rootStore.messageStore
  const userStore = rootStore.userStore
  const commonStore = rootStore.commonStore
  const { changePrivateChannel, getCurrentChannel, channelNotification, cleanNotification, channels, getPrivateChannel} = channelStore
  const { loadMessages } = messageStore
  const { setSelectedChannelType, selectedChannelType, selectedChannelId, setSelectedChannelId} = commonStore

  const { loadUsers, users, user } = userStore
  const currentUser = user

  const changeChannel = async (user: IUser) =>{
    await changePrivateChannel(toJS(user).id)
    let currentChannelId = getCurrentChannel()?.id
    loadMessages(currentChannelId, null)
    setSelectedChannelId(user.id)
    setSelectedChannelType(ChannelType.Room)
  }
  const displayChannels = (users: IUser[]) => {
    if (!currentUser) return <Loader active inline="centered"/>
    console.log("ESTO: "+ JSON.stringify(currentUser, undefined , 2))
    console.log(users)
    const usersFiltrado = users.filter(user => user.id !== currentUser?.id)
    return (
      usersFiltrado.length > 0 && 
      usersFiltrado.map((user) => (
        <DirectMessagesItem key={user.id} user={user} changeChannel={changeChannel} active={selectedChannelId === user.id && selectedChannelType === ChannelType.Room}/>
      ))
    )
  }


  useEffect(() => {
    loadUsers()
  },[loadUsers, changePrivateChannel])

  const getNumberOfUsers = (users: IUser[]) => {
    const usersFiltrado = users.filter(user => user.id !== currentUser?.id)
    return usersFiltrado.length;
  }

 
  
  return (
    <Menu.Menu className='menu'>
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES ({getNumberOfUsers(users)})
                   </span>
      </Menu.Item>
      {displayChannels(users)}
    </Menu.Menu>
  )
}

export default observer(DirectMessages)
