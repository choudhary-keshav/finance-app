import { IconType } from "react-icons";
import { ReactText } from "react";
import React, { ReactNode } from "react";
import { FlexProps } from "@chakra-ui/react";

export interface LinkItemProps {
  name: string;
  icon: IconType;
}
export interface ProfilePageProps {
  children: ReactNode;
}
export interface SidebarWithHeaderProps {
  onClose: () => void;
  isOpen: boolean;
  onOpen: () => void;
}
export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
