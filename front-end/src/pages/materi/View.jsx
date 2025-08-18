import Tabel from "../../components/DataTable/Index";

const MateriView = ({ data, actions, loadMore, hasMore }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Materi (Scroll ke bawah)</h1>

    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4 border-b border-gray-100 flex justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Materi</h2>
        <a href="materi/create" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Tambah</a>
      </div>
      <div className="overflow-x-auto max-h-[700px] overflow-y-auto m-2">
        <Tabel data={data} actions={actions} onLoadMore={loadMore} hasMore={hasMore} />
      </div>
    </div>
  </div>
);
export default MateriView;
