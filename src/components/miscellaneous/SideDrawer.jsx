import React, { useState } from 'react'
import {
  Box,
   Tooltip,
   Button,
   Text,
   Menu,
   useDisclosure 
   ,MenuButton, 
   MenuList, 
   Avatar,
   MenuItem,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Input,
    useToast,
    Spinner
  } from '@chakra-ui/react'
import {BellIcon} from '@chakra-ui/icons';
import {ChatState} from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';


const SideDrawer = () => {
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState(false);
  const [hover,setHover]=useState(false);
  const {isOpen,onOpen,onClose}=useDisclosure();


  const {user,setSelectedChat,chats,setChats,notification,setNotification} =ChatState();
  const navigate=useNavigate();
  const toast=useToast();

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate('/');
  }

  const handleMouseEnter=()=>{
    setHover(true);
  }
  const handleMouseLeave=()=>{
    setHover(false);
  }



  const handleSearch=async()=>{
    if(!search){
      setLoading(true);
      toast({
        title:"Enter Name or Email!!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:'top-left'
    });
    setLoading(false);
    return;
    }
    try {
      setLoading(true);
      
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data}=await axios.get(`http://localhost:8000/api/user?search=${search}`,config)
      
      //console.log(data);
      
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(true);
      toast({
        title:"Error Occured!",
        description:'Failed to Load Users!',
        status:"error",
        duration:5000,
        isClosable:true,
        position:'bottom-left'
    });
    setLoading(false);
    }
  };

  const accessChat=async(userId)=>{
    try {
      setLoadingChat(true);
      
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`,
        }
      };

      const {data}=await axios.post(`http://localhost:8000/api/chat`,{userId},config);
      // console.log(data);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      };
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    } catch (error) {
      setLoadingChat(true);
      toast({
        title:"Error Fetching the Chat",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:'bottom-left'
    });
    setLoadingChat(false);
    }
  }

  return <>
    <Box 
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      bg={'#121212'}
      w={'100%'}
      h={'7vh'}
      p={'5px 10px 5px 10px'}
      borderWidth={'2px 4px 4px 4px'}
      borderColor={'#F4EEE0'}
    >
      <Tooltip label="Search Users"
        hasArrow
        isDisabled
        placement='bottom-end'
        color={'#F4EEE0'}
        backgroundColor={"#121212"}
      >
          <Button  _hover={{color:'#121212', backgroundColor:'#F4EEE0'}} backgroundColor={"#121212"} color={'#F4EEE0'} 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onOpen}
          >
              {hover?<i className="fa-solid fa-magnifying-glass" style={{ color: '#0c0c0c' }}></i>:<i className="fa-solid fa-magnifying-glass" ></i>}
               <Text display={{base:'none',md:'flex'}} p={'4'} 
                color={hover?'#121212':'#F4EEE0'}>
                    Search
               </Text>
          </Button>
      </Tooltip>
      <Text textColor="#F4EEE0" fontSize={'3xl'} fontFamily={"Work Sans"}>
          Texts
      </Text>
      <div>
        <Menu>
          <MenuButton p={1} marginRight={5}>
            <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
            />
            <BellIcon fontSize='2xl' color={'#F4EEE0'}/>
          </MenuButton>
          <MenuList pl={2} backgroundColor={'#121212'} color={'#F4EEE0'}>
              {!notification.length && "No New Messages"}
              {notification.map(not=>(
                <MenuItem key={not._id} backgroundColor={'#121212'} color={'#F4EEE0'} onClick={()=>{
                  setSelectedChat(not.chat);
                  setNotification(notification.filter((n)=>n!==not));
                }}>
                  {not.chat.isGroupChat?`New Message in ${not.chat.chatName}`
                  :`New Message from ${getSender(user,not.chat.users)}`}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton marginRight={5}>
            <Avatar size={'sm'} 
            cursor={'pointer'} 
            name={user.name}
            src={user.pic}
            />
          </MenuButton>
          <MenuList backgroundColor={'#F4EEE0'} color={'#121212'}>
            <ProfileModal user={user}>
            <MenuItem backgroundColor={'#F4EEE0'}>Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutHandler} backgroundColor={'#F4EEE0'}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent  
      border={'5px solid'}
      margin={'5px 5px 5px 2px'}
      backgroundColor='#F4EEE0' 
      textColor={'#121212'}
      >
        <DrawerHeader borderBottomWidth={'1px'}
         color={'#F4EEE0'}
         backgroundColor={'#121212'}
        >Search Users</DrawerHeader>
        <DrawerBody>
          <Box display={'flex'}
          pb={2}
          >
              <Input
                  placeholder='Search User'
                  mr={2}
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
              />
              <Button 
              colorScheme='green'
              backgroundColor={hover?'#F4EEE0':'#121212'} 
              color={hover?'#121212':'#F4EEE0'} 
              onClick={handleSearch}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              isLoading={loading}
              >Go</Button>
          </Box>
          <Box border={'100% solid'} borderColor={'#121212'}>
          {loading?(<ChatLoading/>):
          (
             searchResult?.map((user)=>{
             return (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />
              )
             })
          )
          }
          </Box>
          {loadingChat && <Spinner ml={'auto'} display={'flex'}/>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>
}

export default SideDrawer