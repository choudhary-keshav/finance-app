import React from "react";
import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ProfilePageProps } from "../../interfaces/interface";
import SidebarWithHeader from "./SidebarWithHeader";

const ProfilePage: React.FC<ProfilePageProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarWithHeader onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default ProfilePage;
