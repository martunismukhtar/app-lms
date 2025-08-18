const ExamTab = () => {
  const exams = [
    {
      id: 1,
      title: "Ujian Matematika - Bab 1",
      date: "2025-04-10",
      status: "Belum Dikerjakan",
    },
    {
      id: 2,
      title: "Ujian Bahasa Indonesia - Bab 2",
      date: "2025-04-08",
      status: "Sudah Dikerjakan",
    },
    {
      id: 3,
      title: "Ujian Sains - Bab 3",
      date: "2025-04-12",
      status: "Belum Dikerjakan",
    },
    {
      id: 4,
      title: "Ujian Sejarah - Bab 4",
      date: "2025-04-09",
      status: "Sedang Dikerjakan",
    },
  ];
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Judul Ujian</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{exam.title}</td>
                <td className="px-4 py-3">
                  {new Date(exam.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.status === "Sudah Dikerjakan"
                        ? "bg-green-100 text-green-800"
                        : exam.status === "Sedang Dikerjakan"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {exam.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-500 hover:text-blue-700 font-medium">
                    {exam.status === "Belum Dikerjakan" ? "Mulai" : "Lihat"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default ExamTab;
