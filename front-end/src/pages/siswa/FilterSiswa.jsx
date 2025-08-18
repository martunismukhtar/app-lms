import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Filter } from "lucide-react";
import Input from "../../components/Input/Input";

const FilterSiswa = ({ onFilterChange, refetch }) => {
  const queryClient = useQueryClient();
  const [cariData, setCariData] = useState({
    search: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setCariData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(cariData);
    submitSearch(cariData);
  };

  const submitSearch = (filterData) => {
    onFilterChange(filterData);
    queryClient.invalidateQueries({
      queryKey: ["siswa-per-kelas"],
    });
    refetch();
  };

  const handleReset = () => {
    const resetData = {      
      search: "",
    };
    setCariData(resetData);
    submitSearch(resetData);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-blue-500" /> Filter Pencarian
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input Pencarian */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cari Siswa
          </label>
          <div className="relative">
            <Input
              type="text"
              name="search"
              value={cariData.search}
              onChange={handleInputChange}
              placeholder="Masukkan nama siswa..."
              className="border border-gray-300 pl-10 pr-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition"
            />
          </div>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kelas
          </label>
          <SelectBox
            label="Kelas"
            name="kelas"
            value={cariData.kelas}
            onChange={handleInputChange}
            options={kelasOptions}
          />
        </div> */}
      </div>
      {/* Tombol Cari */}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSearch}
          className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all shadow-sm"
        >
          Cari
        </button>
        <button
          onClick={handleReset}
          className=" cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-md transition-all shadow-sm ml-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
export default FilterSiswa;
