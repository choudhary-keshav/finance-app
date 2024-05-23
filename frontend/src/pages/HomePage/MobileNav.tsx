import React, { useEffect, useState } from "react";
import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationModal from "../modals/LogoutConfirmationModal";

const MobileNav: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const user = useSelector((state: RootState) => state.authentication);
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    localStorage.removeItem("token");
    console.log("ritika");
    navigate("/login");

    onClose();
  };
  return (
    <>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue("white", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent={{ base: "space-between", md: "flex-end" }}
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontFamily="monospace" fontWeight="bold"></Text>

        <HStack spacing={{ base: "0", md: "6" }}>
          <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                <HStack>
                  <Avatar size={"sm"} src={user?.data?.pic} />
                  <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                    <Text fontSize="sm">{user?.data?.name}</Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={openModal}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
      <LogoutConfirmationModal isOpen={isOpen} onClose={onClose} logoutHandler={logoutHandler} />
    </>
  );
};

export default MobileNav;
