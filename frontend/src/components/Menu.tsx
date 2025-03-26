import { IoMdClose } from "react-icons/io";
import { useState } from "react";

interface MenuProps {
  onClose: any;
  children: React.ReactNode;
  show: boolean;
}
export default function Menu({ onClose, children, show }: MenuProps) {
  const [showMenu, SetshowMenu] = useState(false);

  const handleCloseMenu = () => {
    onClose();
    SetshowMenu(!showMenu);
  };
  return (
    <div
      id="menu"
      className={`${show ? "show" : ""} flex-col flex p-10 slide-menu h-100`}
    >
      <button
        className="close-btn cursor-pointer absolute top-[10px] right-[10px]"
        onClick={handleCloseMenu}
      >
        <IoMdClose />
      </button>
      <div className="title text-2xl p-[5px]">My App Menu</div>
      <div onClick={handleCloseMenu} className="flex  justify-start flex-col">
        {children}
      </div>
    </div>
  );
}
