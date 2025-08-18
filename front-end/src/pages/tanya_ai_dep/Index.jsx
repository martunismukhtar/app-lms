import { useContext, useEffect, useRef, useState } from "react";
import PrivateLayout from "../../layouts/private/Index";
import FormChat from "./Form";
import { UserContext } from "../../context/LayoutContext";
import Pesan from "./Pesan";
import { fetchWithAuth } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import HeaderChat from "./Header";

const fetchMapelList = async () => {
  const url = `${import.meta.env.VITE_API}/mata-pelajaran/list/`;
  const res = await fetchWithAuth(url);
  return res;
};

const TanyaAI = () => {
  const { isTyping, messages, setActiveMenu } = useContext(UserContext);  
  const { data: mapelList } = useQuery({
    queryKey: ["mapel-list"],
    queryFn: fetchMapelList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  const [topik, setTopik] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleTopik = (e) => {
    const text = e.target.options[e.target.selectedIndex].text;
    if (e.target.value) setTopik(text);
  };
  useEffect(() => {
    scrollToBottom();    
  }, [messages]);

  useEffect(() => {
    document.title = "Tanya Materi ke AI";
    setActiveMenu("tanya-ai");

  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="max-w-3xl mx-auto h-full flex flex-col bg-white rounded">
        {/* Header Chat */}
        <HeaderChat onChange={handleTopik} mapelList={mapelList} />
        {/* Pesan Chat dengan Scroll Otomatis */}
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
        <FormChat topik={topik} />
      </div>
    </PrivateLayout>
  );
};

export default TanyaAI;
