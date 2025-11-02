import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Accordion, Header, Icon, List, Segment, Image } from 'semantic-ui-react'
import { ChannelType } from '../../Models/channels'
import { RootStoreContext } from '../../Stores/rootStore'

const MetaPanel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const rootStore = useContext(RootStoreContext)
  const { activeChannel, isChannelLoaded } = rootStore.channelStore
  const { userPosts } = rootStore.messageStore
  
  const setCurrentIndex = (event: any, props: any) => {
    const { index } = props
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }
  const displayTopPosters = (posts: { [name: string]: { avatar:string; count: number} }) => {
    return Object.entries(posts).sort((a, b) => b[1].count - a[1].count).map(([key, val], i) => (
      <List.Item key={i}>
        <List.Content>
          <Image avatar src={val.avatar} />
          <List.Header as="a">{key}</List.Header>
          <List.Description>{formatCount(val.count)}</List.Description>
        </List.Content>
      </List.Item>
    )).slice(0, 2)
  }

  const formatCount = (num: number) => {
   return  num > 1 || num === 0 ? `${num} posts` : `${num} post`
  } 

  if (activeChannel?.channelType === ChannelType.Room) return null
  return (
    <Segment loading={!isChannelLoaded}>
      <Header as="h3" attached="top">
        About # {activeChannel && activeChannel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title onClick={setCurrentIndex} index={0} active={activeIndex === 0}>
          <Icon name="dropdown"/>
          <Icon name="info"/>
          Channel details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {activeChannel && activeChannel.description}
        </Accordion.Content>

        <Accordion.Title  onClick={setCurrentIndex} index={1} active={activeIndex === 1}>
          <Icon name="dropdown"/>
          <Icon name="user circle"/>
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {userPosts && displayTopPosters(userPosts)}
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}

export default observer(MetaPanel)
