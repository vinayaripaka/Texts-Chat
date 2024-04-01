import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <div>
        <Box
            px={2}
            py={1}
            borderRadius={'lg'}
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            color={'#F4EEE0'}
            backgroundColor={'#121212'}
            cursor={'pointer'}
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon pl={1}/>
        </Box>
    </div>
  )
}

export default UserBadgeItem