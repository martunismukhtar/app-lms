import React, { createContext, useState } from "react";

// 1. Membuat context
const UserContext = createContext();

// 2. Membuat provider
const UserProvider = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isDisabledButton, setDisabledButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pdfurl, setOpenPDF] = useState(null);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [apakahHapus, setHapus] = useState(false);
  const [dataSoal, buatSoal] = useState([]);
  const [filterData, setFilterData] = useState({
    mapel: "",
    semester: "",
  });
  const [notif, setNotif] = useState({
    type: "",
    message: "",
    duration: 2000,
  });
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo! Ada yang bisa kami bantu?", sender: "ai" },
  ]);

  return (
    <UserContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isTyping,
        setIsTyping,
        messages,
        setMessages,
        isDisabledButton,
        setDisabledButton,
        sidebarOpen,
        setSidebarOpen,
        notif,
        setNotif,
        pdfurl,
        setOpenPDF,
        konfirmasi,
        setKonfirmasi,
        apakahHapus,
        setHapus,
        filterData,
        setFilterData,
        dataSoal,
        buatSoal
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
