import { useEffect, useRef, useState } from "react";

const ChatCustomer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo! Ada yang bisa kami bantu?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    setIsTyping(true);
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleBlur = () => {
    setIsTyping(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Tambahkan pesan pengguna
    const newMessageUser = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessageUser]);

    // setIsTyping(true);
    // Simulasi balasan bot
    setTimeout(() => {
      //   const botReply = {
      //     id: messages.length + 2,
      //     text: "Terima kasih atas pesan Anda!",
      //     sender: "bot",
      //   };
      //   setMessages((prev) => [...prev, botReply]);
      
    }, 1000);

    setInputValue("");
  };

  return (
    <div className="bg-gray-100">
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className="cursor-pointer fixed bottom-[10rem] right-[20px] bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none"
          aria-label="Buka chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <div
          className={`bg-white rounded-lg shadow-xl w-96 h-[700px] flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          {/* Header Chat */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-semibold">Customer Support</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none cursor-pointer"
              aria-label="Tutup chat"
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Pesan Chat dengan Scroll Otomatis */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3"
            id="chat-messages"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Indikator Loading / Bot Sedang Mengetik */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span>Bot sedang mengetik</span>
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Chat */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200"
          >
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
        </div>
      </div>
    </div>
  );
};
export default ChatCustomer;
