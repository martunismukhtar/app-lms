const EnrollButton = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      className="cursor-pointer group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 font-medium"
    >
      <div className="inline-flex h-10 translate-x-0 items-center justify-center bg-white px-6 text-neutral-950 transition group-hover:-translate-x-[150%]">
        Daftarkan Pengajar
      </div>
      <div className="absolute inline-flex h-10 w-full translate-x-[100%] items-center justify-center bg-blue-500 px-6 text-neutral-50 transition duration-300 group-hover:translate-x-0">
        Daftarkan Pengajar
      </div>
    </button>
  );
};
export default EnrollButton;
