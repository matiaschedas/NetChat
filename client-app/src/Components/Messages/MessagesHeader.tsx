import React from 'react'
import { Header, Icon, Segment } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels'
import { IUser } from '../../Models/users'
import SearchInput from './SearchInput'


interface IProps {
  currentChannel: IChannel | null,
  currentUser: IUser | null,
  handleStar: () => void,
  handleSearchChange: (event: any) => void,
  numUniqueUsers: number
}

const MessagesHeader : React.FC<IProps> = ({ currentChannel, currentUser, handleStar, handleSearchChange, numUniqueUsers }) => {
  const isPrivateChannel = () => {
    return currentChannel?.channelType === ChannelType.Room
  }
  const isChannelStarred = currentChannel?.channelType === ChannelType.Starred
  const channelDisplayName = () => {
    const IsPrivateChannel = isPrivateChannel()
    var DisplayName : string = "" 
    if(IsPrivateChannel){
      DisplayName+="@"
      if(currentUser?.userName == currentChannel?.name){
        DisplayName+=currentChannel?.description
      }
      else{
        DisplayName+= currentChannel?.name
      }
    }
    else{
      DisplayName+=currentChannel?.name
    }
    return DisplayName
  }
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelDisplayName()}
          {(isPrivateChannel()===false || isChannelStarred===true) && <Icon name={isChannelStarred ? 'star' : 'star outline'} color={isChannelStarred ? 'yellow': 'black'} onClick={handleStar} />}
        </span>
        {(isPrivateChannel()===false || isChannelStarred===true) && <Header.Subheader>{numUniqueUsers} Users</Header.Subheader>}
      </Header>
      <SearchInput handleSearchChange={handleSearchChange} />
    </Segment>
  )
}

export default MessagesHeader
