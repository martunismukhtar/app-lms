import { useMateriBerdasarkanId } from "../../../data/Index";

const HeaderChat = ({ id_materi }) => {
  const { data, isLoading, isError } = useMateriBerdasarkanId(id_materi);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Gagal mengambil data materi...</h1>;
  }

  return (
    <div className="bg-white border-b border-gray-200 text-black px-4 py-3 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center space-x-2 text-xl">
        <h1>Materi : {data?.title}</h1>
      </div>
    </div>
  );
};
export default HeaderChat;
