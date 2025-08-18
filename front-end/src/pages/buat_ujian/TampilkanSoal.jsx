import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import QuestionList from "./buat_soal/QuestionList";
import { useSoalUjian } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";

const DataSoalUjian = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useSoalUjian(id);

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }
  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Tampilkan Soal</h1>
        <QuestionList questions={data} />
      </div>
    </PrivateLayout>
  );
};

export default DataSoalUjian;
