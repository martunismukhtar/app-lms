import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/LayoutContext";
import { fetchWithAuth } from "../../services/api";

const fetchChatHistory = async (topik) => {
  const url = `${import.meta.env.VITE_API}/chat-materi/history/?topik=${encodeURIComponent(topik)}`;
  const res = await fetchWithAuth(url);
  return res;
};

const FormChat = ({ topik }) => {
  const [inputValue, setInputValue] = useState("");
  const { setIsTyping, messages, setMessages } = useContext(UserContext);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    if (topik) {
      //history
      fetchChatHistory(topik).then((res) => {
        if (!res || !res.chat_sessions || res.chat_sessions.length === 0)
          return;

        const chats = res.chat_sessions[0].chat_messages;
        if (Array.isArray(chats) && chats.length > 0) {
          chats.forEach((chat) => {
            const newMessageUser = {
              id: chat.id,
              text: chat.message,
              sender: chat.sender,
            };
            setMessages((prev) => [...prev, newMessageUser]);
          });
        }
      });      
    } else {
      setMessages([
        { id: 1, text: "Halo! Ada yang bisa kami bantu?", sender: "ai" },
      ]);
    }
  }, [topik, setMessages]);

  const handleBlur = () => {
    setIsTyping(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    if (!topik) {
      alert("Pilih mata pelajaran terlebih dahulu");
      return;
    }
    // Tambahkan pesan pengguna
    const newMessageUser = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessageUser]);

    setIsTyping(true);

    const url = `${import.meta.env.VITE_API}/chat-materi/`;
    fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topik: topik,
        pertanyaan: inputValue,
      }),
    })
      .then((res) => {
        console.log(res.answer);
        const botReply = {
          id: messages.length + 2,
          text: res.answer,
          sender: "ai",
        };
        setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);
      })
      .catch(() => {
        setIsTyping(false);
        alert("Terjadi kesalahan jaringan atau server.");
      });

    setInputValue("");
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default FormChat;
