import { Text,Image,IconButton, Button,Modal, ModalBody,ModalFooter, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import React from 'react'

const ProfileModal = ({user,children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
  return <>
  {
    children?(<span onClick={onOpen}>{children}</span>):
    (
        <IconButton
        display={{base:'flex'}}
        icon={<ViewIcon/>}
        onClick={onOpen}
        />
    )
    }
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent backgroundColor={'#F4EEE0'}
        >
            <ModalHeader
             fontSize={'40px'}
             fontFamily={'Work sans'}
             display={'flex'}
             justifyContent={'center'}
             backgroundColor={'#121212'}
             color={'#F4EEE0'}
            >
                {user.name}
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody display={'flex'}
                marginLeft={'13%'}
            >
                <Image
                    borderRadius={'full'}
                    boxSize={'70px'}
                    src={user.pic}
                    alt={user.name}
                />
                <Text fontSize={{base:'14px',md:'18px'}}
                fontFamily={'Work sans'}
                padding={'5%'}
                >
                    {user.email}
                </Text>
            </ModalBody>

            <ModalFooter
                display={'flex'}
                justifyContent={'center'}
            >
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  </>
}

export default ProfileModal