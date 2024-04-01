import React, { useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack} from '@chakra-ui/react'
import {useToast} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [show,setShow]=useState(false);
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const navigate=useNavigate();

    const handleClick=()=>{
        setShow(!show);
    }

    const submitHandler=async()=>{
        setLoading(true);
        if(!email || !password){
            toast({
                title:"Fill all the fields!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            setLoading(false);
            return;
        }
        try{
            const config={
                header:{
                    "Content-type":"application/json",
                },
            };

            const {data}=await axios.post("http://localhost:8000/api/user/login",
            {email,password},
            config
            );
            toast({
                title:"Login Successful!",
                status:"success",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            localStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch(err){
            toast({
                title:"Error Occured!",
                description:err.response.data.message,
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });
            setLoading(false);
        }
    }

  return <VStack spacing={'5px'}>
    <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
            <Input 
                value={email}
                placeholder='Enter email address'
                onChange={(e)=>{setEmail(e.target.value)}}
            />
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input 
            value={password}
            type={show?"text":'password'}
                placeholder='Enter password'
                onChange={(e)=>{setPassword(e.target.value)}}
            />
        <InputRightElement width={'4.5rem'}>
            <Button h='1.75ren' size={'sm'} onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>
   
    <Button
        colorScheme='green'
        width={'100%'}
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
    >
        Login
    </Button>
    <Button
        variant={'solid'}
        colorScheme='red'
        width={'100%'}
        style={{marginTop:15}}
        onClick={()=>{
            setEmail('guest@example.com');
            setPassword('123456')
        }}
        isLoading={loading}
    >
        Guest Login
    </Button>
  </VStack>
}


export default Login