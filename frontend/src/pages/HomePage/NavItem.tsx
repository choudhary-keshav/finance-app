import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { NavItemProps } from "../../interfaces/interface";
import { Link } from "react-router-dom";

const NavItem: React.FC<NavItemProps> = ({ icon, children, to }) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        marginTop={2}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
export default NavItem;
