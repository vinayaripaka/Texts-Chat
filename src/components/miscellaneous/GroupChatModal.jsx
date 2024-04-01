import React,{useState} from 'react'
import { FormControl, useDisclosure } from '@chakra-ui/react'
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,useToast,Input
  } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);

    const toast=useToast();

    const {user,chats,setChats}=ChatState();

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return;
        }
        try{
            setLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data}=await axios.get(`http://localhost:8000/api/user?search=${search}`,config);
           
            // console.log(data);


            setSearchResult(data);
            setLoading(false);
        }catch(error){
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

    const handleSubmit=async()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title:"Enter ChatName and Add Users",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'top'
            });
            return;
        }
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.post(`http://localhost:8000/api/chat/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config);

            setChats([data,...chats]);
            onClose();
            toast({
                title:"New Group Chat Created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
        } catch (error) {
            toast({
                title:"Failed to Create Chat!",
                description:error.response.data,
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
        }
    };

    const handleGroup=(userToAdd)=>{
            if(selectedUsers.includes(userToAdd)){
                setLoading(true);
                toast({
                  title:"User already added",
                  status:"Warning",
                  duration:5000,
                  isClosable:true,
                  position:'top'
              });
              setLoading(false);
              return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    };

    const handleDelete=(delUser)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>
            sel._id!==delUser._id
        ))
    }


    // useEffect(()=>{
    //     console.log(selectedUsers);
    // },[selectedUsers])


  return (
    <div>
        <span onClick={onOpen}>{children}</span>

        <Modal isOpen={isOpen} onClose={onClose}>
             <ModalOverlay />
                <ModalContent>
            <ModalHeader
                fontSize={'35px'}
                fontFamily={'Work sans'}
                display={'flex'}
                justifyContent={'center'}
                textColor={'#F4EEE0'}
                backgroundColor={'#121212'}
            >
                Create Group Chat
            </ModalHeader>
            <ModalCloseButton color={'F4EEE0'}/>
         <ModalBody
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
         >
            <FormControl>
            <Input placeholder='Chat Name' mb={3}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                />
            
            </FormControl>
            <FormControl>
            <Input placeholder='Add Users eg: Goku, Gojo, Naruto' mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                />
            
            </FormControl>
        <Box w='100%' display='flex' flexWrap='wrap'>
            {selectedUsers.map((u)=>(
            <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={()=>handleDelete(u)}
            />
           ))}
        </Box>
           {loading?<div>loading...</div>:(
                searchResult?.slice(0,4).map(user=>(
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=>handleGroup(user)}
                    />
                ))
           )
           }
        </ModalBody>

        <ModalFooter justifyContent={'center'}>
      <Button 
      _hover={'none'}
      backgroundColor={'#121212'} 
      color={'#F4EEE0'}
      onClick={handleSubmit}
      >Create Chat</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </div>
  )
}

export default GroupChatModal