// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Icon,
  Input,
  // Link,
  Switch,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from "@chakra-ui/react";
import {Link as ChakraLink } from "@chakra-ui/react"
import {Link as ReactLink } from 'react-router-dom'
import { Route, Redirect } from 'react-router-dom'
// Assets
import BgSignUp from "assets/img/BgSignUp.png";
import { React, useState, useEffect } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import axios from 'axios';


function SignUp() {
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("teal.200", "rgba(255, 255, 255, 0.5)");
  const [isLoading, setIsLoading] = useState(false);
  const [CreateUserError, setCreateUserError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loginRedirect, setloginRedirect] =  useState(false);
  const [formData, setFormData] = useState({
    username:'',
    email:'',
    password:'',
  });

  const [touched, setTouched] = useState({
    username:false,
    email:false,
    password:false
  });


  const updateTouchedState = (e) => {
    const { name } = e.target
    // console.log('Update touched state for: ', name)
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // console.log('Setting: ', name, ' with: ', value)
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const isEmail = !touched || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isNameEmpty = formData.username === ''
  const isPasswordEmpty = formData.password === ''

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // console.log('Payload being sent: ', formData)
      // console.log('Endpoint is: ', process.env.REACT_APP_BACKEND_URL)
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/create`, formData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Create User Response ', response.data)
      if (response.status) {
        const loginresponse = await await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`, formData,{
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const authToken = loginresponse?.headers?.getAuthorization()
        const { userId, userName, email } = loginresponse?.data || {};
        sessionStorage.setItem('authToken', authToken)
        sessionStorage.setItem('userId',userId)
        sessionStorage.setItem('userName',userName)
        sessionStorage.setItem('email',email)
        setloginRedirect(true);
      } else {
        console.log('Create User Failed')
        setCreateUserError(`Failed to create user ${error.response.data.message}`)
        setShowError(true)
      }
      // Add session token to localstorage
    } catch (error) {
      console.error('Sign Up Failed:', error.response.data.message);
      setCreateUserError(`Sign Up Failed ${error.response.data.message}`);
      setShowError(true)
      // Handle error (show error message, etc.)
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'>
      <Box
        position='absolute'
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left='0'
        right='0'
        bgRepeat='no-repeat'
        overflow='hidden'
        zIndex='-1'
        top='0'
        bgImage={BgSignUp}
        bgSize='cover'
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}></Box>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='6.5rem'
        mb='30px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Welcome!
        </Text>
        {/* <Text
          fontSize='md'
          color='white'
          fontWeight='normal'
          mt='10px'
          mb='26px'
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}>
          Use these awesome forms to login or create new account in your project
          for free.
        </Text> */}
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
        <Flex
          direction='column'
          w='445px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow='0 20px 27px 0 rgb(0 0 0 / 5%)'>
          <Text
            fontSize='xl'
            color={textColor}
            fontWeight='bold'
            textAlign='center'
            mb='22px'>
            Register With
          </Text>
          {/* username Form Element */}
          <FormControl isInvalid = {isNameEmpty && touched.username}>
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Name
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              name='username'
              type='text'
              value={formData.username}
              placeholder='Your full name'
              mb='4px'
              size='lg'
              onBlur={updateTouchedState}
              onChange={handleFormChange}
            />
            {isNameEmpty ? (
              <FormErrorMessage ms = '20px'> Please enter a username</FormErrorMessage>
            ) : (
              null
            )}
          </FormControl> 
          {/* Email Form Element */}
          <FormControl isInvalid= {!isEmail && touched.email}>
            <FormLabel ms='4px' mt='24px' fontSize='sm' fontWeight='normal'>
              Email
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              name='email'
              type='email'
              value={formData.email}
              onBlur={updateTouchedState}
              onChange = {handleFormChange}
              placeholder='Your email address'
              mb='5px'
              size='lg'
            />
            {!isEmail ? (
              <FormErrorMessage ms = '20px'> Please enter a valid email</FormErrorMessage>
            ) : (
              null
            )}
          </FormControl> 
          {/* Password Form Element */}
          <FormControl isInvalid = {isPasswordEmpty && touched.password}>  
            <FormLabel ms='4px' mt='24px' fontSize='sm' fontWeight='normal'>
              Password
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              name='password'
              type='password'
              value={formData.password}
              onBlur={updateTouchedState}
              onChange={handleFormChange}
              placeholder='Your password'
              mb='4px'
              size='lg'
            />
            {isPasswordEmpty ? (
              <FormErrorMessage ms = '20px'> Please enter a password</FormErrorMessage>
            ) : (
              null
            )}

            <Button
              type='submit'
              bg='teal.300'
              fontSize='10px'
              color='white'
              fontWeight='bold'
              w='100%'
              h='45'
              mb='24px'
              mt='24px'
              isLoading={isLoading}
              isDisabled={isNameEmpty || isPasswordEmpty || !isEmail}
              onClick={handleSignUp}
              _hover={{
                bg: "teal.200",
              }}
              _active={{
                bg: "teal.400",
              }}>
              SIGN UP
            </Button>
              
          </FormControl> 

          <Flex>
            {CreateUserError && showError && (
              <Box 
                position="fixed" 
                top="20px" 
                left="50%" 
                transform="translateX(-50%)" 
                zIndex="toast"
                width="90%" 
                maxWidth="500px"
              >
                <Alert 
                  status="error" 
                  variant="subtle" 
                  borderRadius="md" 
                  boxShadow="lg"
                >
                  <AlertIcon />
                  <Flex direction="column">
                    <AlertTitle>Create User Error</AlertTitle>
                    <AlertDescription>
                      {CreateUserError}
                    </AlertDescription>
                  </Flex>
                  <CloseButton 
                    onClick={() => setShowError(false)} 
                    position="absolute"
                    right="8px"
                    top="8px"
                  />
                </Alert>
              </Box>
            )}
          </Flex>

          {loginRedirect && (
              <Redirect to="/admin/dashboard" />
          )}

          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            maxW='100%'
            mt='0px'>
            <Text color={textColor} fontWeight='medium'>
              Already have an account?
              <ChakraLink
                as = {ReactLink}
                to="/auth/signin"
                color={titleColor}
                // as='span'
                ms='5px'
                fontWeight='bold'>
                Sign In
              </ChakraLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
