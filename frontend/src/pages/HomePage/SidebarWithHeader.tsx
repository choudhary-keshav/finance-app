import React from "react";
import { SidebarWithHeaderProps } from "../../utils/interfaces/interface";
import { Drawer, DrawerContent } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";

const SidebarWithHeader: React.FC<SidebarWithHeaderProps> = ({ onClose, isOpen, onOpen }) => {
  return (
    <div style={{}}>
      <SidebarContent onClose={onClose} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
    </div>
  );
};
export default SidebarWithHeader;
