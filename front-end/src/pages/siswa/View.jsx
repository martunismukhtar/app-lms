import Tabel from "../../components/DataTable/Index";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

const UserView = ({
  data = [],
  actions = [],
  loadMore,
  hasMore,
  isLoadingMore = false,
}) => {
  return (
    <>
      <div className="p-6">
        <div className="flex justify-end items-center mb-4">
          <Link
            to="/users/create"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          >
            Tambah
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-3">
          <div className="flex justify-between items-center flex-wrap min-h-[70px] px-9 bg-transparent border-b border-[#F1F1F4] text-xl">
            Daftar Siswa
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto m-2">
            <Tabel
              data={data}
              actions={actions}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
            {isLoadingMore && <LoadingSpinner size="small" className="py-2" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserView;
