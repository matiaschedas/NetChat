import React, { ChangeEvent, useContext, useState, useEffect } from 'react'
import { Button, Form, Icon, Input, Modal, ModalActions } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels'
import { v4 as uuid } from 'uuid'
import { RootStoreContext } from '../../Stores/rootStore'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const ChannelForm: React.FC = () => {
  const initialChannel = {
    id: '',
    name: '',
    description: '',
    channelType: ChannelType.Channel
  }
  const [channel, setChannel] = useState<IChannel>(initialChannel)
  const channelStore = useContext(RootStoreContext).channelStore
  const { isModalVisible, showModal, createChannel, setNavigate } = channelStore;
  const navigate = useNavigate();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    //console.log(event.target.value)
    setChannel({ ...channel, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    setNavigate(navigate)
  },[navigate, setNavigate])

  const handleSubmit = () => {
     if (channel.name.trim() === '') {
      toast.error('Channel name is required!');
      return;
    }
    let newChannel = {
      ...channel,
      id: uuid(),
      description: channel.description.trim() === '' ? 'No description provided' : channel.description
    }
    createChannel(newChannel)
    setChannel(initialChannel)
    showModal(false);
  }
  return (
    <Modal basic open={isModalVisible}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input fluid label="Channel Name" onChange={handleInputChange} name="name" />
        </Form.Field>
        <Form.Field>
          <Input fluid label="Description" onChange={handleInputChange} name="description" />
        </Form.Field>
      </Form>
    </Modal.Content>

    <ModalActions>
      <Button basic color='green' inverted onClick={() => handleSubmit()}>
        <Icon name='checkmark' /> Add
      </Button>
      <Button color='red' inverted onClick={() => showModal(false)}>
        <Icon name='remove' /> Cancel
      </Button>
    </ModalActions>
  </Modal>
  )
}

export default observer(ChannelForm)
