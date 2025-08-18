
import DaftarSoalUjian from "./View";
import PrivateLayout from "../../layouts/private/Index";
import { UserContext } from "../../context/LayoutContext";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSoalBerdasarkanIdUjian } from "../../data/Index";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";


const Ujian = () => {
  const { setActiveMenu } = useContext(UserContext);
  const { id }= useParams();

  useEffect(() => {
    document.title = "Daftar Soal";
    setActiveMenu("ujian");
  }, [setActiveMenu]);

  const { data: soal, isLoading, isError, error, refetch } = useSoalBerdasarkanIdUjian(id);

  if(isLoading){
    return <LoadingComponent/>
  }

  if(isError){
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>      
      <DaftarSoalUjian data={soal} id_ujian={id} />
    </PrivateLayout>
  );
};
export default Ujian;
