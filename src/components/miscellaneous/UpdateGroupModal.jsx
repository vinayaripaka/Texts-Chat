import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure,Modal,ModalOverlay,
ModalContent,
ModalHeader,
ModalBody,
ModalFooter,
ModalCloseButton,
Button,
useToast,Box, FormControl,Input,Spinner
} from '@chakra-ui/react'
import React, {useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {

    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false);
    const toast=useToast();

    const {selectedChat,setSelectedChat,user}=ChatState();


    const handleRemove=async(user1)=>{
        if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
            toast({
                title:"Only admins can remove users in group!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            return;
        }
        try {
            setLoading(true);

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.put('http://localhost:8000/api/chat/groupremove',{
                userId:user1._id,
                chatId:selectedChat._id,
            },config)

           user1._id===user._id? setSelectedChat():setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            setLoading(false);
        }
    };

    const handleRename=async()=>{
        if(!groupChatName) return;
        try {
            setRenameLoading(true);
            
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.put(`http://localhost:8000/api/chat/rename`,{
                chatId:selectedChat._id,
                chatName:groupChatName,
            },config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

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

    const handleAddUser=async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:"User Already in group!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            return;
        }
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                title:"Only admins can add users!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            return;
        }
        try {
            setLoading(true);

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.put('http://localhost:8000/api/chat/groupadd',{
                userId:user1._id,
                chatId:selectedChat._id,
            },config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            setLoading(false);
        }
    };

    // useEffect(()=>{
    //     console.log(searchResult)
    // },[searchResult]);


  return <>
  <IconButton onClick={onOpen}
  display={{base:'flex'}}icon={<ViewIcon/>}
  />

  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent backgroundColor={'#F4EEE0'}>
      <ModalHeader
        fontSize={'35px'}
        fontFamily={'Work sans'}
        display={'flex'}
        justifyContent={'center'}
        backgroundColor={'#121212'}
        color={'#F4EEE0'}
      >{selectedChat.chatName}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}
        pb={3}
        >
        {selectedChat.users.map((u)=>(
            <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={()=>handleRemove(u)}
            />
        ))}
        </Box>
        <FormControl display={'flex'}>
            <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e)=>setGroupChatName(e.target.value)}
            />
            <Button
                _hover={'none'}
                _active={'none'}
                variant={'solid'}
                backgroundColor={'#121212'}
                color={'#F4EEE0'}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
            >
                Update
            </Button>
        </FormControl>
        <FormControl>
            <Input placeholder='Add Users eg: Goku, Gojo, Naruto' mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            {loading?(<Spinner size='lg'/>):(
                searchResult?.map((user)=>(
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=>handleAddUser(user)}
                    />
                ))
            )}
      </ModalBody>

      <ModalFooter>
        <Button color='#F4EEE0' _hover='none' _active={'none'} bg='red' mr={3} onClick={()=>handleRemove(user)} >
          Leave Group
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</>
}

export default UpdateGroupModal