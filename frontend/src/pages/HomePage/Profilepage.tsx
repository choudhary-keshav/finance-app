import React from "react";
import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ProfilePageProps } from "../../utils/interfaces/interface";
import SidebarWithHeader from "./SidebarWithHeader";
import AllRoutes from "../../AllRoutes";

const ProfilePage: React.FC<ProfilePageProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" minW="100%" >
      <SidebarWithHeader onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 20 }} p="1">
        {children}
        <div style={{ height: '100%',minHeight:'500px', width: '85%', backgroundColor: "white", marginLeft: 200 }}>
          <AllRoutes />
        </div>
      </Box>
    </Box>
  );
};

export default ProfilePage;
