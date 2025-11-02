import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Button, Icon, Input, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../Stores/rootStore'

interface IProps {
  uploadFile: (file: Blob|null) => void 
}

const FileModal : React.FC<IProps> = ({ uploadFile }) => {
  const rootStore = useContext(RootStoreContext)
  const { isModalVisible, showModal } = rootStore.messageStore
  const [image, setImage] = useState<Blob | null>(null)
  const [imageSelected, setImageSelected] = useState(false)
  const addFile = (event: any) => {
    const file = event.target.files[0]
    if(file && file.type.startsWith("image/")){
      setImage(file)
      setImageSelected(true)
    }
  }
  const sendFile = () => {
    uploadFile(image)
    showModal(false)
    clearFile()
    //console.log("se ejecuto sendFile")
  }
  const clearFile = () => {
    setImage(null)
    setImageSelected(false)
  }
  return (
    <Modal basic open={isModalVisible} onClose={() => showModal(false)}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input fluid label="File types: jpg, png" name="file" type="file" onChange={addFile}/>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile} disabled={!imageSelected}>
          <Icon name="checkmark"/> Send
        </Button>
        <Button color="red" inverted onClick={() => showModal(false)}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default observer(FileModal)
