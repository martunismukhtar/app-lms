export const transformMateriData = (pages = []) => {
  return pages.flatMap((page) =>
    (page?.results || []).map(({ id, title, mapel_nama, file }) => ({
      'ID': id,
      'Judul': title || 'Tidak ada judul',
      'Mata Pelajaran': mapel_nama || 'Tidak ada mata pelajaran',
      'file': file || 'Tidak ada file',
    }))
  );
};