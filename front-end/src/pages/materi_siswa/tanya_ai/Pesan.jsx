import { useContext } from "react";
import { UserContext } from "../../../context/LayoutContext";

const Pesan = () => {
  const { messages } = useContext(UserContext);
  return (
    <>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </>
  );
};
export default Pesan;
