import Select from "../../components/SelectBox/Select";

const HeaderChat = ({ mapelList, onChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 text-black px-4 py-3 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Select
          label="Mata Pelajaran"
          name="mapel"
          onChange={onChange}
          required={true}
          options={mapelList?.map((item) => ({
            value: item.id,
            label: item.nama,
          }))}
        />
      </div>
    </div>
  );
};
export default HeaderChat;
