import React from "react";
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  Image,
} from "@chakra-ui/react";
import { FiTrendingUp, FiCompass, FiStar, FiSettings } from "react-icons/fi";
import { LinkItemProps } from "../../interfaces/interface";
import NavItem from "./NavItem";
import logoImg from "../../assets/images/download-removebg-preview.png";
import { NavLink } from "react-router-dom";

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiSettings, to: "/" },
  { name: "Upload Excel Sheet", icon: FiTrendingUp, to: "/upload" },
  { name: "View Expense", icon: FiCompass, to: "/view" },
  { name: "Analyse Expense", icon: FiStar, to: "/analyse" },
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
      backgroundColor="#e2e2e2b0"
    >
      <Flex
        marginTop={5}
        marginBottom={12}
        h="20"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          margin="auto"
        >
          <Image
            borderRadius="cover"
            boxSize="90px"
            src={logoImg}
            alt="logo"
            align="center"
          />
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} to={link.to}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};
export default SidebarContent;
