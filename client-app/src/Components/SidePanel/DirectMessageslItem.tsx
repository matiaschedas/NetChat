import React, { useContext } from 'react'
import { Icon, Label, Menu, Popup} from 'semantic-ui-react'
import { IChannel } from '../../Models/channels'
import { IUser } from '../../Models/users'
import { RootStoreContext } from '../../Stores/rootStore';

interface IProps {
  user: IUser,
  changeChannel: (user: IUser) => void,
  active: boolean
}

const DirectMessagesItem: React.FC<IProps>= ({ user, changeChannel, active}) => {

  const isUserOnline = (user: IUser) => {
    return user.isOnline
  }

  return (
        <Menu.Item active={active} key={user.email} onClick={() => changeChannel(user)} name={user.userName} style={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}>
         <Popup
            content={isUserOnline(user) ? 'Disponible' : 'No disponible'}
            position="top center"
            trigger={
                    <Icon name="circle" color={isUserOnline(user) ? 'green': 'red'} style={{ marginRight: '0.5em'}} />
                          
            }/>
            {user.userName}
        </Menu.Item>
  )
}

export default DirectMessagesItem
