import React, { useContext, useEffect, useState } from 'react'
import { IMessage, MessageType } from '../../Models/messages'
import { Comment, CommentAuthor, CommentAvatar, CommentContent, CommentMetadata, CommentText, Image} from 'semantic-ui-react'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import { RootStoreContext } from '../../Stores/rootStore'
import { IUser } from '../../Models/users'

interface IProps{
  message: IMessage
  previousMessage: IMessage | null
  currentUser: IUser|null
}
const getOwnClass = (message: IMessage, user: IUser | null) => {
  //console.log("EL USER DEL MENSAJE: "+JSON.stringify(message, undefined, 2))
  return message.sender?.email === user!.email ? 'message__self' : ''
}

const isOwnMessage = (message: IMessage, user: IUser | null) => {
  return message.sender?.email === user!.email
}

const Message : React.FC<IProps> = ({ message, currentUser, previousMessage }) => {
  const rootStore = useContext(RootStoreContext)
  const { setImageSelected, showImageModal } = rootStore.messageStore
  const handleSubmit = (imageUrl: string) => {
    setImageSelected(imageUrl)
    showImageModal(true)
  }

  return (
    <Comment>
      {!isOwnMessage(message, currentUser) && (previousMessage && previousMessage?.sender.email !== message.sender.email) && <CommentAvatar src={message.sender?.avatar ?? 'http://www.gravatar.com/avatar/?=identicon'}/>}
      {!isOwnMessage(message, currentUser) && (!previousMessage) && <CommentAvatar src={message.sender?.avatar ?? 'http://www.gravatar.com/avatar/?=identicon'}/>}
      {!isOwnMessage(message, currentUser) && (previousMessage && previousMessage?.sender.email === message.sender.email) && <CommentAvatar src={message.sender?.avatar ?? 'http://www.gravatar.com/avatar/?=identicon'} style={{ visibility: 'hidden' }}/>}
      <CommentContent className={getOwnClass(message, currentUser)} >
      {isOwnMessage(message, currentUser) ? (
        <>
          { (previousMessage && previousMessage?.sender.email !== message.sender.email) && <CommentAuthor as="a">Yo</CommentAuthor>}
          { !previousMessage && <CommentAuthor as="a">Yo</CommentAuthor>}
          <CommentMetadata>{moment(message.createdAt).fromNow()}</CommentMetadata>
          {message.messageType === MessageType.Text && (
            <CommentText>{message.content}</CommentText>
          )}
          {message.messageType === MessageType.Media && (
            <CommentText>
              <Image
                src={message.content}
                onClick={() => handleSubmit(message.content)}
                className="message__image"
                alt="upload media"
                bordered
                size="small"
                rounded
              />
            </CommentText>
          )}
        </>
      ) : (
        <>
          { (previousMessage && previousMessage?.sender.email !== message.sender.email) && <CommentAuthor as="a">{message.sender?.userName ?? "null"}</CommentAuthor> }
          { !previousMessage && <CommentAuthor as="a">{message.sender?.userName ?? "null"}</CommentAuthor>}
          <CommentMetadata>{moment(message.createdAt).fromNow()}</CommentMetadata>
          {message.messageType === MessageType.Text && (
            <CommentText>{message.content}</CommentText>
          )}
          {message.messageType === MessageType.Media && (
            <CommentText>
              <Image
                src={message.content}
                onClick={() => handleSubmit(message.content)}
                className="message__image"
                alt="upload media"
                bordered
                size="small"
                rounded
              />
            </CommentText>
          )}
        </>
      )}
      </CommentContent>
    </Comment>
  )
}

export default observer(Message)
