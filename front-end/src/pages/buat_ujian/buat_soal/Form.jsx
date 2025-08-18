import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/LayoutContext";
import { fetchWithAuth } from "../../services/api";
import LoadingButton from "../../components/LoadingButton";
import { useQuery } from "@tanstack/react-query";

const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  REFETCH_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// API Functions
const fetchMapelList = async () => {
  const url = `mata-pelajaran/list/`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response;
};

// Custom Hook for Mata Pelajaran Data
const useMapelData = () => {
  return useQuery({
    queryKey: ["mapel-list"],
    queryFn: fetchMapelList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: QUERY_CONFIG.STALE_TIME,
    cacheTime: QUERY_CONFIG.CACHE_TIME,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const FormBuatSoal = ({ topik }) => {
  const [inputValue, setInputValue] = useState("");
  const { setIsTyping, messages, setMessages } = useContext(UserContext);

  const subjects = ["Matematika", "Fisika", "Kimia", "Biologi", "Sejarah"];
  const semesters = ["Ganjil", "Genap"];

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedSemester) return;

    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockQuestions();
      setQuestions(mockData);
      setLoading(false);
    }, 1000); // Simulasi delay jaringan
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

    const url = `${import.meta.env.VITE_API}/buat-soal/`;
    fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topik: topik,
        pertanyaan: inputValue,
      }),
    })
      .then((res) => {
        console.log(res);
        // const botReply = {
        //   id: messages.length + 2,
        //   text: res.answer,
        //   sender: "ai",
        // };
        // setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);
      })
      .catch(() => {
        setIsTyping(false);
        alert("Terjadi kesalahan jaringan atau server.");
      });

    setInputValue("");
  };

  const FormActions = ({ isLoading }) => (
    <>
      <hr className="border-gray-300 mb-4" />
      <div className="flex justify-end">
        <LoadingButton
          isLoading={isLoading}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          {isLoading ? "Menyimpan..." : "Simpan Materi"}
        </LoadingButton>
      </div>
    </>
  );

  const { data: mapelData, isLoading: isMapelLoading, error: mapelError } = useMapelData();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SelectBox
          label="Mata Pelajaran"
          name="mapel"
          required={true}
          error={error.mapel}
          value={formData.mapel}
          onChange={handleInputChange}
          options={mapelOptions}
        />
        </div>

        <div>
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pilih Semester
          </label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">-- Pilih Semester --</option>
            {semesters.map((sem, index) => (
              <option key={index} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormActions isLoading={isLoading} />
    </form>
  );
};

export default FormBuatSoal;
