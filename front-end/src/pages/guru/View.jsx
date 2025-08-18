import Tabel from "../../components/DataTable/Index";

const ViewGuru = ({
  data = [],
  actions = [],
  loadMore,
  hasMore,
  isLoadingMore = false,
}) => {
  return (
    <div className="p-2">
      <div className="overflow-x-auto max-h-[700px] overflow-y-auto m-2">
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
};
export default ViewGuru;
