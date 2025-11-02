import { observer } from 'mobx-react-lite'
import React from 'react'
import { Label, Menu } from 'semantic-ui-react'
import { IChannel } from '../../Models/channels'

interface IChannelItemProps
{
  channel: IChannel
  changeChannel: (channel: IChannel) => void
  active: boolean
  getNotificationCount: (channel: IChannel) => number | undefined
}

const ChannelItem: React.FC<IChannelItemProps> = ({ channel, changeChannel, active, getNotificationCount }) => {
  return (

        <Menu.Item active={active} key={channel.id} onClick={() => changeChannel(channel)} name={channel.name} style={{ opacity: 0.7 }}>
          {
            getNotificationCount(channel) && (
              <Label color="red">{getNotificationCount(channel)}</Label>
            )
          }
          # {channel.name}
        </Menu.Item>
    )
  }

export default observer(ChannelItem)
