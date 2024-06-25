import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { setUser } from "../../redux/features/authenticationSlice";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/services/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createUser] = useLoginMutation();

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
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const data = await createUser({ email, password });
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
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      dispatch(setUser(data));
      localStorage.setItem("token", JSON.stringify(data?.data?.token));
      navigate("/");
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
      <Button colorScheme="blue" width="50%" style={{ marginTop: 15 }} onClick={submitHandler}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
