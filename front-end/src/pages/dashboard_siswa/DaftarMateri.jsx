import { useParams } from "react-router-dom";
import ErrorComponent from "../../components/error/Index";
import LoadingComponent from "../../components/loading/Index";
import PrivateLayout from "../../layouts/private/Index";
import { useMateriDetail } from "./data";
import ModalPDF from "../../components/ModalPDF/Index";
import { usePdfModal } from "../../hooks/usePdfModal";

const DaftarMateri = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useMateriDetail(id);
  const { openPdf } = usePdfModal();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  const bukaMateri = (url) => {
    let newUrl = `${import.meta.env.VITE_SERVER}${url.file}`;
    console.log(newUrl);
    openPdf(newUrl)
  }

//openPdf(item.file)
  return (
    <PrivateLayout>
      <div className="w-full bg-white rounded-lg shadow p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Materi</h1>
          <p className="text-gray-600">
            Pilih mata pelajaran untuk melihat detail materi.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {data?.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.content}</p>
              <div className="mt-4">
                <button 
                  onClick={() => bukaMateri(item)}
                  className="cursor-pointer text-sm text-blue-500 hover:underline">
                  Lihat Selengkapnya →
                </button>
              </div>
            </div>
          </div>
           ))}
        </div>
      </div>
      <ModalPDF />
    </PrivateLayout>
  );
};
export default DaftarMateri;
