import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { setUser } from "../../redux/features/authenticationSlice";
import { useDispatch } from "react-redux";
import { useSignupMutation } from "../../redux/services/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createNewUser] = useSignupMutation();
  const passwordRegex = /(?=.*[!@#\$%\^\&*\)\(+=._-])/g;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showNotification = (
    title: string,
    status: "error" | "info" | "warning" | "success" | "loading" | undefined
  ) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && typeof error === "object" && "status" in error;
  };

  const hasMessage = (error: any): error is { message: string } => {
    return error && typeof error === "object" && "message" in error;
  };

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmpassword) {
      showNotification("Please Fill all the Fields", "warning");
      return;
    }
    if (name.length > 60) {
      showNotification("Name cannot be longer than 60 characters", "warning");
      return;
    }
    if (email.length > 320) {
      showNotification("Email cannot be longer than 320 characters", "warning");
      return;
    }
    if (!email.match(emailRegex)) {
      showNotification("Email must be a valid address", "warning");
      return;
    }
    if (password !== confirmpassword) {
      showNotification("Passwords Do Not Match", "warning");
      return;
    }
    if (password.length < 8 || password.length > 60) {
      showNotification("Password length must be between 8 and 60", "warning");
      return;
    }
    if (!password.match(passwordRegex)) {
      showNotification("Password must contain atleast one special character", "warning");
      return;
    }
    
    try {
      const data = await createNewUser({ name, email, password });
      console.log(data);
      if (data.error) {
        showNotification(
          isFetchBaseQueryError(data.error) && data.error.data && hasMessage(data.error.data)
            ? data.error.data.message
            : "An error occured",
          "warning"
        );
        return;
      }
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      dispatch(setUser(data));
      localStorage.setItem("token", JSON.stringify(data?.data?.token));
      navigate("/", { state: data?.data?.token });
    } catch (error: any) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Full Name" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme="blue" width="50%" style={{ marginTop: 15 }} onClick={submitHandler}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
