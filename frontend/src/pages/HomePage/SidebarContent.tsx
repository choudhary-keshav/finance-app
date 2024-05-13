import React from "react";
import { Box, CloseButton, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings} from "react-icons/fi";
import { LinkItemProps} from "../../interfaces/interface";
import NavItem from "./NavItem";

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Upload Excel Sheet", icon: FiTrendingUp },
  { name: "View Expense", icon: FiCompass },
  { name: "Analyse Expense", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];
const SidebarContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};
export default SidebarContent;
