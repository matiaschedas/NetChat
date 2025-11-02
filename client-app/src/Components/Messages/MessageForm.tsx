import React, { useContext, useEffect, useRef, useState} from 'react'
import { Button, Form, Input, Segment } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form'
import { IMediaFormValues, IMessageFormValues, ITypingNotification } from '../../Models/messages'
import TextInput from '../Common/Form/TextInput'
import { RootStoreContext } from '../../Stores/rootStore'
import { FORM_ERROR } from 'final-form'
import FileModal from './FileModal'
import { useDebounce } from './useDebounce'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { getEmojiDataFromNative } from 'emoji-mart'

interface EmojiSkin {
  unified: string
}

interface Emoji {
  shortcodes?: string | string[]
  unified: string
  skins?: EmojiSkin[]
}

// Definimos el tipo para el objeto data.emojis
interface EmojiData {
  emojis: Record<string, Emoji>
}


const shortcodeToUnicode: Record<string, string> = {}
const emojiData = data as unknown as EmojiData
const emojis = emojiData.emojis
for (const emoji of Object.values(emojis)) {
  if (!emoji.shortcodes) continue
  const shortcodes = Array.isArray(emoji.shortcodes) ? emoji.shortcodes : [emoji.shortcodes]
  for (const shortcode of shortcodes) {
    const unified = emoji.unified
    if (shortcode === "melting_face") {
      console.log("🧪 Found melting_face emoji:", emoji)
      console.log("🧪 unified usado:", unified)
    }
    if (unified) {
      const unicode = unified.split('-').map(u => String.fromCodePoint(parseInt(u, 16))).join('')
      shortcodeToUnicode[shortcode] = unicode
    }
  }
}

const MessageForm = () => {
  const rootStore = useContext(RootStoreContext)
  const { getCurrentChannel } = rootStore.channelStore
  const { sendMessage, showModal, uploadImage, loadMessages, messages} = rootStore.messageStore
  const { user } = rootStore.userStore
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const isTyping = useRef(false)
  const [emojiPicker, setEmojiPicker] = useState<boolean>(false)
  const textInputref = useRef<HTMLInputElement>(null)

  const handleTogglePicker = () => {
    setEmojiPicker(!emojiPicker)
  }

  const handleSubmitForm = async (values: IMessageFormValues) => {
    const valuesWithChannel = {
      content: values.content,
      channelId: getCurrentChannel().id,
    }
    var typing: ITypingNotification = {
        sender: user!,
        channelId: getCurrentChannel().id!
      }
    rootStore.messageStore.stopTyping(typing)
    await sendMessage(valuesWithChannel).catch((error: unknown) => ({[FORM_ERROR]: error}))
  }

  const uploadFile = async (image: Blob|null) => {
    console.log("se subio la imagen")
    const media: IMediaFormValues = {
      file: image!,
      channelId: getCurrentChannel()?.id
    }
    await uploadImage(media).catch((error) => ({[FORM_ERROR]: error}))
  }


  const startTyping = () => {
    if (!isTyping.current) {
      isTyping.current = true
      var typing: ITypingNotification = {
        sender: user!,
        channelId: getCurrentChannel().id!
      }
      rootStore.messageStore.startTyping(typing)
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      isTyping.current = false
      var typing: ITypingNotification = {
        sender: user!,
        channelId: getCurrentChannel().id!
      }
      rootStore.messageStore.stopTyping(typing)
    }, 3000) // 3 segundos sin escribir = dejó de tipear
  }

 
  const colonToUnicode = (message: string): string => {
    return message.replace(/:([a-zA-Z0-9_+-]+):/g, (match, shortcode) => {
      // shortcode viene sin los dos puntos, ej "smile"
      const emoji = shortcodeToUnicode[shortcode]
      if (emoji) {
        return emoji
      }
      return match // si no encuentra, devuelve el texto original (con los dos puntos)
    })
  }


  return (
    <FinalForm onSubmit={handleSubmitForm} 
      render={({ handleSubmit, form, invalid, dirtySinceLastSubmit, pristine, values }) =>{

      const handleEmojiSelect = (emoji: any) => {
         const input = textInputref.current as HTMLInputElement
          if (!input) return

          const start = input.selectionStart || 0
          const end = input.selectionEnd || 0
          const text = input.value
          const emojiChar = emoji.native

          const newText = text.slice(0, start) + emojiChar + text.slice(end)

          form.change('content', newText)

          // Opcional: posicionar el cursor después del emoji
          setTimeout(() => {
            input.selectionStart = input.selectionEnd = start + emojiChar.length
            input.focus()
          }, 0)

          setEmojiPicker(false)
      }

      return (
      <Form onSubmit={(event) => {
        event.preventDefault()
        const trimmed = values.content?.trim()
        if (!trimmed) return // bloquea si está vacío
        handleSubmit(event)?.then(() => form.reset())
      }}>
        <Segment>
          {emojiPicker && <Picker set="apple" title="Pick your emoji" emoji="point_up" onEmojiSelect={handleEmojiSelect} />}
          <Field onChange={() => startTyping()} inputRef={textInputref} emojiPicker={emojiPicker} handleTogglePicker={handleTogglePicker} component={TextInput} IconLabel fluid name="content" style={{ marginBottom: '0.7em', fontFamily: 'Segoe UI Emoji' }} label={<Button icon={'add'}/>}
          labelPosition="left" placeholder="Write your messages">
          </Field>
          <Button.Group icon widths="2">
            <Button color="orange" content="Add Reply" labelPosition="left" icon="edit" type="submit" disabled={(invalid && !dirtySinceLastSubmit) || pristine}/>
            <Button color="teal" content="Upload Media" labelPosition="right" icon="cloud upload" type='button' onClick={() => showModal(true)}/>
            
          </Button.Group>
          <FileModal uploadFile={uploadFile}/>
        </Segment>

      </Form>
      )}}/>
  )
}

export default MessageForm
