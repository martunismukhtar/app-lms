export const transformMateriData = (data = []) => {
  return data.map(({ id, name }) => ({
    ID: id,
    NAMA: name,
  }));
};
