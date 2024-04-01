import React,{useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, useToast,Button,Stack,Text } from '@chakra-ui/react';
import  axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';


const MyChats = ({fetchAgain}) => {
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const toast=useToast;

    const fetchChats=async()=>{
      // console.log(user);
      try {
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        };

        const {data}=await axios.get('http://localhost:8000/api/chat',config);
        setChats(data);
      } catch (error) {
        toast({
          title:"Error Occured!",
          description:"Failed to load chats",
          status:"error",
          duration:5000,
          isClosable:true,
          position:'bottom-left'
      });
      }
    };

    // eslint-disable-next-line
    useEffect(()=>{
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
      fetchChats();
    },[fetchAgain])

  return <Box
  display={{base:selectedChat?"none":"flex",md:'flex'}}
  flexDir={'column'}
  alignItems={'center'}
  p={1.5}
  color={'#121212'}
  backgroundColor={'#F4EEE0'}
  w={{base:"100%",md:'31%'}}
  borderRadius={'lg'}
  borderWidth={'1px'}
  borderColor={'#121212'}
  >
    <Box
    p={3}
    px={3}
    color={'#F4EEE0'}
    borderRadius={'lg'}
    backgroundColor={'#121212'}
    fontSize={{base:'28px',md:'30px'}}
    fontFamily={"Work sans"}
    display={'flex'}
    w={'100%'}
    justifyContent={'space-between'}
    alignItems={'center'}
    >
      Chats
      <GroupChatModal>
      <Button
        color={'#F4EEE0'}
        backgroundColor={'#121212'}
        _hover={'none'}
        _active={'none'}
        display={'flex'}
        fontSize={{base:'17px',md:'10px',lg:'17px'}}
        rightIcon={<AddIcon/>}
      >
          Add Group
      </Button>
      </GroupChatModal>
    </Box>
    <Box
      display={'flex'}
      flexDir={'column'}
      p={3}
      marginTop={'2px'}
      bg={'#121212'}
      w={'100%'}
      h={'100%'}
      borderRadius={'lg'}
      overflow={'hidden'}
    >
      {chats?(
        <Stack overflowY={'scroll'}
        borderRadius={'lg'}
        >
          {chats.map((chat)=>(
            <Box
              key={chat?._id}
              onClick={()=>setSelectedChat(chat)}
              cursor={'pointer'}
              bg={selectedChat===chat?"#F4EEE0":'#121212'}
              color={selectedChat===chat?'#121212':'#F4EEE0'}
              px={3}
              py={2}
              borderRadius={'lg'}
            >
              <Text>
                {
                  !(chat.isGroupChat)?
                  (
                    getSender(loggedUser,chat?.users)

                  )
                  :
                  (chat?.chatName)
                }
              </Text>
            </Box>
          ))}
        </Stack>
      ):(
        <ChatLoading/>
      )}
    </Box>
  </Box>
}

export default MyChats