// import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ChatCustomer from "../../components/ChatCustomer/Index";

const LandingLayout = ({ children }) => {
  // const [scroll, setScroll] = useState(0);
  // const [showScroll, setShowScroll] = useState(false);

  // const handleScroll = () => {
  //   setScroll(window.scrollY);
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   if (scroll > 400) {
  //     setShowScroll(true);
  //   } else {
  //     setShowScroll(false);
  //   }
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [scroll]);

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
      {children}
      </div>
      <Footer />

      {/* Chat */}
      <ChatCustomer />
    </div>
  );
};
export default LandingLayout;