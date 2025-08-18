import { MESSAGES } from "../utils/CONSTANTA";
import Button from "./Button/Index";

const LoadingButton = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-gray-400 to-gray-500">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        {MESSAGES.LOADING}
      </div>
    );
  }

  return (
    <Button
      type="submit"
      className="max-w-2xs flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {MESSAGES.SAVE}
    </Button>
  );
};

export default LoadingButton;