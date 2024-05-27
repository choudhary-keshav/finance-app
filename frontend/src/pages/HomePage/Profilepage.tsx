import React from "react";
import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ProfilePageProps } from "../../interfaces/interface";
import SidebarWithHeader from "./SidebarWithHeader";
import AllRoutes from "../../AllRoutes";

const ProfilePage: React.FC<ProfilePageProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarWithHeader onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
      <div style={{ height: 700, width: 1500, backgroundColor: "white", marginLeft: 250 }}>
       <AllRoutes />
      </div>
    </Box>
  );
};

export default ProfilePage;
