import { Loader2 } from "lucide-react";

const LoadingTable = () => {
  return (
    <div className="flex justify-center items-center min-h-[100px]">
      <Loader2 className="animate-spin" />
      <span className="ml-2">Loading...</span>
    </div>
  );
};
export default LoadingTable;
