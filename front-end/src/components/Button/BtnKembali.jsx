import { useNavigate } from "react-router-dom";

const BtnKembali = ({ fallback = "/", label = "Kembali", className = "" }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // kembali ke halaman sebelumnya
    } else {
      navigate(fallback); // kalau tidak ada history, arahkan ke fallback
    }
  };

  return (
    <div className="mr-4 flex items-center">
      <div
        onClick={handleBack}
        className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-transparent px-6 font-medium border text-black ${className} cursor-pointer`}
      >
        <div className="mr-0 w-0 -translate-x-[100%] opacity-0 transition-all duration-200 group-hover:mr-1 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100">
          <svg
            width="24px"
            height="124px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5303 5.46967C10.8232 5.76256 10.8232 6.23744 10.5303 6.53033L5.81066 11.25H20C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75H5.81066L10.5303 17.4697C10.8232 17.7626 10.8232 18.2374 10.5303 18.5303C10.2374 18.8232 9.76256 18.8232 9.46967 18.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L9.46967 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967Z"
                fill="#1C274C"
              ></path>{" "}
            </g>
          </svg>
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
};
export default BtnKembali;
