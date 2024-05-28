import React from "react";
import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ProfilePageProps } from "../../interfaces/interface";
import SidebarWithHeader from "./SidebarWithHeader";
import AllRoutes from "../../AllRoutes";

const ProfilePage: React.FC<ProfilePageProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" minW="100%" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarWithHeader onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 20 }} p="1">
        {children}
        <div style={{ height: '100%',minHeight:'500px', width: '80%', backgroundColor: "white", marginLeft: 180 }}>
          <AllRoutes />
        </div>
      </Box>
    </Box>
  );
};

export default ProfilePage;
