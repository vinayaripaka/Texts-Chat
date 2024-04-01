import React,{useState} from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';

const ChatsPage = () => {
    const {user}=ChatState();
    const [fetchAgain,setFetchAgain]=useState(false);


  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer/>}
       <Box
       backgroundColor={'#121212'}
       display={"flex"}
       justifyContent={'space-between'}
       w={'100%'}
       h={'93vh'}
       p={'10px'}
       >
            {user && <MyChats fetchAgain={fetchAgain}/>}
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
       </Box>
    </div>
  )
}

export default ChatsPage