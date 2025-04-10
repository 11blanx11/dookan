// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
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
// Assets
import signInImage from "assets/img/signInImage.png";
import {Link as ChakraLink } from "@chakra-ui/react"
import {Link as ReactLink } from 'react-router-dom'
import { Route, Redirect } from 'react-router-dom'
import { React, useState } from "react";
import axios from 'axios';

function SignIn() {


  const [formData, setFormData] = useState({
    email:'',
    password:'',
  });

  const [touched, setTouched] = useState({
    email:false,
    password:false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loginRedirect, setloginRedirect] =  useState(false);
  const isPasswordEmpty = formData.password === ''
  const isEmail = !touched || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  
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


  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Payload being sent: ', formData)
      console.log('Endpoint is: ', process.env.REACT_APP_BACKEND_URL)

      const loginresponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`, formData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (loginresponse.status) {
        const authToken = loginresponse?.headers?.getAuthorization() || loginresponse?.headers['Authorization'];
        console.log('Login Response: ', loginresponse?.headers?.getAuthorization())
        const { userId, userName, email } = loginresponse?.data || {};
        sessionStorage.setItem('authToken', authToken)
        sessionStorage.setItem('userId',userId)
        sessionStorage.setItem('userName',userName)
        sessionStorage.setItem('email',email)
        setloginRedirect(true);
      } else {
        console.log('User Login Failed')
        setLoginError(`User Login Failed ${error.response.data.message}`)
        setShowError(true)
      }
    // Add session token to localstorage)
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(`Sign In Failed ${error.response.data.message}`);
      setShowError(true)
    } finally {
      setIsLoading(false);
    }
  };

  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex position='relative' mb='40px'>
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ sm: "100px", md: "0px" }}>
        <Flex
          alignItems='center'
          justifyContent='start'
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}>
          <Flex
            direction='column'
            w='100%'
            background='transparent'
            p='48px'
            mt={{ md: "150px", lg: "80px" }}>
            <Heading color={titleColor} fontSize='32px' mb='10px'>
              Welcome Back
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColor}
              fontWeight='bold'
              fontSize='14px'>
              Enter your email and password to sign in
            </Text>
            <FormControl isInvalid= {!isEmail && touched.email}>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Email
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='4px'
                fontSize='sm'
                placeholder='Your email adress'
                size='lg'
                name='email'
                type='email'
                value={formData.email}
                onBlur={updateTouchedState}
                onChange = {handleFormChange}
              />
              {!isEmail ? (
                <FormErrorMessage ms = '20px'> Please enter a valid email</FormErrorMessage>
              ) : (
                null
              )}
            </FormControl>

            <FormControl isInvalid = {isPasswordEmpty && touched.password}>
              <FormLabel ms='4px' mt='24px
              ' fontSize='sm' fontWeight='normal'>
                Password
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='4px'
                fontSize='sm'
                name='password'
                type='password'
                value={formData.password}
                onBlur={updateTouchedState}
                onChange={handleFormChange}
                placeholder='Your password'
                size='lg'
              />
              {isPasswordEmpty ? (
                <FormErrorMessage ms = '20px'> Please enter a password</FormErrorMessage>
              ) : (
                null
              )}
              {/* <FormControl display='flex' alignItems='center'>
                <Switch id='remember-login' colorScheme='teal' me='10px' />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  ms='1'
                  fontWeight='normal'>
                  Remember me
                </FormLabel>
              </FormControl> */}
              <Button
                fontSize='10px'
                type='submit'
                bg='teal.300'
                w='100%'
                h='45'
                mt='36px'
                mb='20px'
                color='white'
                isLoading = {isLoading}
                isDisabled = {isPasswordEmpty || !isEmail}
                onClick = {handleSignIn}
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}>
                SIGN IN
              </Button>
            </FormControl>

            <Flex>
              {loginError && showError && (
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
                      <AlertTitle>User Login Error</AlertTitle>
                      <AlertDescription>
                        {loginError}
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
                Don't have an account?
                <ChakraLink
                  as = {ReactLink}
                  to="/auth/signup"
                  color={titleColor}
                  // as='span'
                  ms='5px'
                  fontWeight='bold'>
                  Sign Up
                </ChakraLink>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX='hidden'
          h='100%'
          w='40vw'
          position='absolute'
          right='0px'>
          <Box
            bgImage={signInImage}
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius='20px'></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
