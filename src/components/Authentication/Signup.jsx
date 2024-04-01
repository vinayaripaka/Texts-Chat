import React, { useEffect, useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack} from '@chakra-ui/react'
import {useToast} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
const Signup = () => {
    const navigate=useNavigate();
    const [show,setShow]=useState(false);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [pic,setPic]=useState('');
    const [loading,setLoading]=useState(false);
    const toast=useToast();

    const handleClick=()=>{
        setShow(!show);
    }

    const postDetails=(pics)=>{
        setLoading(true);
        if(pics===undefined){
            toast({
                title:`Select an Image!`,
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom",
            });
            return;
        }

        if(pics.type==='image/jpeg' || pics.type==='image/png'){
            const data=new FormData();
            data.append("file",pics);
            data.append("upload_preset","texts-app");
            data.append("cloud_name","gojosatoru67");
            axios.post('https://api.cloudinary.com/v1_1/gojosatoru67/image/upload', data)
            .then((res)=>{
                setPic(res.data.url.toString());
                console.log(res.data.url);
                setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                setLoading(false);
            });
        } else{
            toast({
                title:`Select Jpeg or png!`,
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"buttom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler=async()=>{
       setLoading(true);
       if(!name||!email||!password||!confirmpassword){
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
       if(password!==confirmpassword){
        toast({
            title:"Password Does Not Match!",
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
                headers:{
                    "Content-type":"application/json",
                },
            };
            const {data}=await axios.post("http://localhost:8000/api/user/signup",
            {name,email,password,pic},
            config);
            toast({
                title:"Registration Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:'bottom'
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
       }catch(err){
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
    useEffect(()=>{
        console.log(pic);
    },[pic]);

  return <VStack spacing={'5px'}>
    <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
            <Input 
                placeholder='Enter Name'
                onChange={(e)=>{setName(e.target.value)}}
            />
    </FormControl>
    <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
            <Input 
                placeholder='Enter email address'
                onChange={(e)=>{setEmail(e.target.value)}}
            />
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input 
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
    <FormControl id='password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
        <Input 
            type={show?"text":'password'}
                placeholder='Confirm password'
                onChange={(e)=>{setConfirmpassword(e.target.value)}}
            />
        <InputRightElement width={'4.5rem'}>
            <Button h='1.75ren' size={'sm'} onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>
    <FormControl id='pic'>
        <FormLabel>Upload Profile Picture</FormLabel>
            <Input 
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e)=>{postDetails(e.target.files[0])}}
            />
    </FormControl>
    <Button
        colorScheme='green'
        width={'100%'}
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
    >
        Sign Up
    </Button>
  </VStack>
}

export default Signup