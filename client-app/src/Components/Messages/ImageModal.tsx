import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Modal, Button} from 'semantic-ui-react'
import { RootStoreContext } from '../../Stores/rootStore'

const ImageModal = () => {

  const rootStore = useContext(RootStoreContext)
  const { showImageModal, isImageModelVisble, imageSelected} = rootStore.messageStore

  return (
    <Modal
    open={isImageModelVisble}
    onClose={() => showImageModal(false)}
    basic
    style={{ margin: 0 }}
  >
    <Modal.Content
      style={{
        padding: 0,
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={imageSelected!}
        alt="fullscreen"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />

      <Button
        color="red"
        content="Cerrar"
        onClick={() => showImageModal(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      />
    </Modal.Content>
  </Modal>
  )
}

export default observer(ImageModal)
