import Tabel from "../../components/DataTable/Index";
import LoadingSpinner from "../../components/LoadingSpinner";

const KelasView = ({
  data = [],
  actions = [],
  loadMore,
  hasMore,
  isLoadingMore = false,
}) => {
  return (
    <>
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">          
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

export default KelasView;
