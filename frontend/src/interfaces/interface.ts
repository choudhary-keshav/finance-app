import { IconType } from "react-icons";
import { ReactText } from "react";
import { ReactNode } from "react";
import { FlexProps } from "@chakra-ui/react";

export interface LinkItemProps {
  name: string;
  icon: IconType;
  to: string;
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
  to: string;
  icon: IconType;
  children: ReactText;
}
export interface UserState {
  data: {
    _id: string;
    name: string;
    email: string;
    pic: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  pic: string;
  token: string;
}
export interface generateTokenPayload {
  _id: string;
  name: string;
  email: string;
  pic: string;
}
