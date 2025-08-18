import PrivateLayout from "../../layouts/private/Index";
import ErrorMessage from "../ErrorMessage";

const ErrorComponent = ({ error, handleRetry }) => {
  return (
    <PrivateLayout>
      <div className="p-6">
        <ErrorMessage
          message={error?.message || "Gagal memuat data"}
          onRetry={handleRetry}
        />
      </div>
    </PrivateLayout>
  );
};
export default ErrorComponent;
