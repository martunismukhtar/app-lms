import Tabel from "../../components/DataTable/Index";
import LoadingSpinner from "../../components/LoadingSpinner";

const MateriView = ({
  data = [],
  actions = [],
  loadMore,
  hasMore,
  isLoadingMore = false,
}) => (
  <div className="p-2">
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
);

export default MateriView;
