import React,{useEffect} from 'react'
import {Box, Container,Text} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate=useNavigate();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));
    if(user){
      navigate('/chats');
    }
  },[navigate]);
  return (
    <Container maxW='xl' centerContent>
      <Box d="flex" justifyContent="center" p={3} 
        bg={"#121212"}
        w="100%"
        m="40px 0 5px 0"
        borderRadius="lg"
        borderBottom="1px"
        borderLeftWidth="5px"
        borderColor="#F4EEE0"
      >
        <Text fontSize="4xl" fontFamily="Work sans"
          color="#F4EEE0"
          textAlign="center"
        >Texts</Text>
      </Box>
      <Box bg={"#F4EEE0"} w="100%" p={4} color={"black"}
      borderRadius={'lg'} borderLeftWidth={'5px'} 
      borderBottomWidth={'1px'}
      borderColor={'grey'}>
        <Tabs variant='soft-rounded' colorScheme='red'>
        <TabList mb={'1em'} >
                <Tab width='50%'>Login</Tab>
              <Tab width='50%'>Sign-Up</Tab>
         </TabList>
        <TabPanels>
      <TabPanel><Login/> </TabPanel>
      <TabPanel> <Signup/> </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage