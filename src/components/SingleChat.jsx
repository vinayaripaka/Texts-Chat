import React,{useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box,FormControl,IconButton,Spinner,Text,Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupModal from './miscellaneous/UpdateGroupModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';


const ENDPOINT="http://localhost:8000";
var socket,selectedChatCompare;


const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();

    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(false);
    const [newMessage,setNewMessage]=useState();
    const toast=useToast();
    const [socketConnected,setSocketConnected]=useState(false);
    const [typing,setTyping]=useState(false);
    const [isTyping,setIsTyping]=useState(false);

    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit("setup",user);
        socket.on('connected',()=>{
            // console.log('Connected');
            setSocketConnected(true);
        })
        socket.on("typing",()=>setIsTyping(true));
        socket.on("stop typing",()=>setIsTyping(false));
    },[]);

    const sendMessage=async(event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit("stop typing",selectedChat._id);
            try {
                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`,
                    },
                };
                setNewMessage("");

                const {data}=await axios.post(`http://localhost:8000/api/message`,{
                    content:newMessage,
                    chatId:selectedChat._id,
                },config);

                // console.log(data);

                socket.emit("new message",data);
                setMessages([...messages,data]);
            } catch (error) {
                toast({
                    title:"Error Occured!",
                    description:"Failed to send the Message",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                });
            }
        }
    };

    const fetchMessages=async()=>{
        if(!selectedChat) return;
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const {data}=await axios.get(`http://localhost:8000/api/message/${selectedChat._id}`,config);

            // console.log(data);
            // console.log(messages);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat",selectedChat._id);
        } catch (error) {
             toast({
                    title:"Error Occured!",
                    description:"Failed to Load the Message",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                });
        }
    };

     // eslint-disable-next-line
    useEffect(()=>{
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);

    useEffect(()=>{
        socket.on('message received',(newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id){
              if(!notification.includes(newMessageReceived)){
                setNotification([newMessageReceived,...notification]);
                setFetchAgain(!fetchAgain)
              }
            }
            else{
                setMessages([...messages,newMessageReceived]);
            }
        });
    });

    // console.log(notification,"-------");


    const typingHandler=(e)=>{
        setNewMessage(e.target.value);

        // Typing Indicator Logic

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }
        let lastTypingTime=new Date().getTime();
        var timerLength=3000;
        setTimeout(()=>{
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;
            if(timeDiff>=timerLength && typing){
                socket.emit('stop typing',selectedChat._id);
                setTyping(false);
            }
        },timerLength)
    };

    // useEffect(()=>{
    //     console.log(selectedChat);
    // },[selectedChat])
  return <>{
        selectedChat?(
            <>
            <Text
                fontSize={{base:'28px',md:'30px'}}
                py={3}
                px={4}
                w={'100%'}
                fontFamily={'Work sans'}
                display={'flex'}
                justifyContent={{base:'space-between'}}
                alignItems={'center'}
                backgroundColor={'#121212'}
                color={'#F4EEE0'}
                borderRadius={'lg'}
                // fontStyle={'Bold'}
            >
                <IconButton
                    backgroundColor={'#121212'}
                    _hover={'none'}
                    _active={'none'}
                    color='#F4EEE0'
                    display={{base:'flex',md:'none'}}
                    icon={<ArrowBackIcon/>}
                    onClick={()=>setSelectedChat("")}
                />
                {!selectedChat.isGroupChat?(
                    <>
                    {getSender(user,selectedChat.users)}
                    <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                    </>
                ):(
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                    />
                    </>
                )
                }
            </Text>
            <Box 
                display={'flex'}
                flexDir={'column'}
                justifyContent={'flex-end'}
                p={3}
                bg={'#121212'}
                marginTop={2}
                color={'#F4EEE0'}
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}
            >

                {loading?(
                    <Spinner
                        size={'xl'}
                        w={20}
                        h={20}
                        alignSelf={'center'}
                        margin={'auto'}
                    />
                ):(
                         <div className="messages">
                            <ScrollableChat messages={messages}/>
                        </div>
                    )}
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping?<div>Typing...</div>:<></>}
                    <Input
                        // variant={'filled'}
                        bg='#F4EEE0'
                        placeholder='Enter a message..'
                        onChange={typingHandler}
                        value={newMessage}
                        color={'#121212'}
                    />
                </FormControl>
            </Box>
            </>
        ):(
            <>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    h={'100%'}
                >
                    <Text
                     fontSize={'3xl'}
                     pb={3}
                     fontFamily={'Work sans'}
                    >
                        Click on a user to start chatting!
                    </Text>
                </Box>
            </>
        )
    }</>
}
export default SingleChat