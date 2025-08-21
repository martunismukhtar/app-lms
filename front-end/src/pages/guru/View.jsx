import Tabel from "../../components/DataTable/Index";

export const ViewGuru = ({
  data = [],
  actions = [],
  loadMore,
  hasMore,
  isLoadingMore = false,
}) => {
  return (
    <div className="overflow-x-auto h-[700px] overflow-y-auto m-2">
      <Tabel
        data={data}
        actions={actions}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />
      {isLoadingMore && <LoadingSpinner size="small" className="py-2" />}
    </div>
  );
};
// export default ViewGuru;
