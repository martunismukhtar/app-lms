import ErrorComponent from "../../components/error/Index";
import Input from "../../components/Input/Index";
import LoadingComponent from "../../components/loading/Index";
import LoadingButton from "../../components/LoadingButton";
import PrivateLayout from "../../layouts/private/Index";
import useFormProfile from "./useForm";

const Profile = () => {
  const {
    data,
    errorProfile,
    isErrorProfile,
    loadingProfile,
    handleSubmit,
    handleInputChange,
    refetch,
    isLoading
  } = useFormProfile()

  if (loadingProfile) {
    return <LoadingComponent />;
  }

  if(isErrorProfile) {
    return <ErrorComponent error={errorProfile} handleRetry={refetch} />
  }

  return (
    <PrivateLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <form method="post" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    placeholder="Username"
                    readOnly={true} 
                    value={data.username || ""}  
                    onChange={handleInputChange}                  
                  />
                </div>
                <div className="w-full">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={data.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    label="Nama"
                    type="text"
                    name="nama"
                    placeholder="Nama"
                    required
                    value={data.nama || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Password"                    
                    value={data.password || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <LoadingButton isLoading={isLoading} />
              </div>
            </form>
          </div>
        </div>
      </div>      
    </PrivateLayout>
  );
};
export default Profile;
