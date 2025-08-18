export const transformMateriData = (pages = []) => {
  return pages.flatMap((page) =>
    (page?.results || []).map(({ id, username, nama, kelas }) => ({
      'ID': id,      
      'USERNAME': username || 'Tidak ada username',
      'NAMA': nama,
      'kelas': kelas || 'Tidak ada kelas',
    }))
  );
};