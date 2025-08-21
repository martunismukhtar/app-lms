import { useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../context/LayoutContext";
import PrivateLayout from "../../layouts/private/Index";
import ErrorMessage from "../../components/ErrorMessage";
import { Link } from "react-router-dom";
import { useDataMapelMateri } from "../mapel/useData";
import { Loader2 } from "lucide-react";
import ViewMapelMateri from "./ViewMapelMateri";

const Materi = () => {
  const { setActiveMenu } = useContext(UserContext);
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch
  } = useDataMapelMateri();

  useEffect(() => {
    document.title = "Materi";
    setActiveMenu("materi");
  }, [setActiveMenu]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);


  if (isError) {
    return (
      <PrivateLayout>
        <div className="p-6">
          <ErrorMessage
            message={error?.message || "Gagal memuat data materi"}
            onRetry={handleRetry}
          />
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Materi</h2>
          
        </div>

        {isLoading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
        {!isLoading && !isError && data && data.length === 0 && (
          <div>Tidak ada data</div>
        )}    

        <ViewMapelMateri data={data} />  
        
        
      </div>
    </PrivateLayout>
  );
};

export default Materi;
