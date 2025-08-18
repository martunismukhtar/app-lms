
import {
  Users,
  Plus  
} from "lucide-react";
import { Link } from "react-router-dom";

const ClassCard = ({ classData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{classData.mata_pelajaran}</h3>          
          <div className="flex items-center mt-3 text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span>{classData.jumlah_siswa} siswa</span>
          </div>
        </div>        
      </div>
      <div className="mt-4">
        <Link 
          to={`/materi/create`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Materi
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
