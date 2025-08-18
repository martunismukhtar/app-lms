import PrivateLayout from "../../layouts/private/Index";
import LoadingSpinner from "../LoadingSpinner";

const LoadingComponent = () => {
  return (
    <PrivateLayout>
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    </PrivateLayout>
  );
};
export default LoadingComponent;
