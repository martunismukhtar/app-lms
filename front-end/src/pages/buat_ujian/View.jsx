import Tabel from "../../components/DataTable/Index";
import LoadingSpinner from "../../components/LoadingSpinner";
import FilterUjian from "./FilterUjian";

const ViewBuatUjian = ({
  data = [],
  actions = [],
  loadMore,
  hasMore,
  isLoadingMore = false,
  refetch,
  onFilterChange
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Filter Section */}
      <FilterUjian 
        onFilterChange={onFilterChange}
        refetch={refetch}
      />

      {/* Tabel Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
        <Tabel
          data={data}
          actions={actions}
          onLoadMore={loadMore}
          hasMore={hasMore}
        />
        {isLoadingMore && (
          <div className="text-center py-4">
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBuatUjian;
