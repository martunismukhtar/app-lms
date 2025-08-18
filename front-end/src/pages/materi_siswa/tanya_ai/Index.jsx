import { useContext, useEffect, useRef } from "react";
import FormChat from "./Form";
import Pesan from "./Pesan";
import { UserContext } from "../../../context/LayoutContext";
import PrivateLayout from "../../../layouts/private/Index";
import { useParams } from "react-router-dom";
import HeaderChat from "./Header";


const TanyaAI = () => {
  const {id} = useParams()
  const { isTyping, messages, setActiveMenu } = useContext(UserContext);  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();    
  }, [messages]);

  useEffect(() => {
    document.title = "Tanya Materi ke AI";
    setActiveMenu("materi-siswa");

  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="max-w-3xl mx-auto h-full flex flex-col bg-white rounded">       
        <HeaderChat id_materi={id} />
        <div
          className="flex-1 p-4 overflow-y-auto space-y-3"
          id="chat-messages"
        >
          <Pesan />

          {/* Indikator Loading / Bot Sedang Mengetik */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 max-w-xs">
                <div className="flex items-center space-x-2">
                  <span>Sedang mengetik</span>
                  <div className="flex space-x-1">
                    <span
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Form Input Chat */}
        <FormChat id_materi={id}/>
      </div>
    </PrivateLayout>
  );
};

export default TanyaAI;
