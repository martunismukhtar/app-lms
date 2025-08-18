const MESSAGES = {
  SUCCESS: "Data berhasil ditambahkan",
  ERROR_DEFAULT: "Terjadi kesalahan, data gagal ditambahkan",
  ERROR_NETWORK: "Terjadi kesalahan jaringan atau server.",
  LOADING: "Loading...",
  SAVE: "Simpan",
};
const API_ENDPOINTS = {

  KELAS : "kelas/",
  GET_SOAL:"soal/",
  GET_SOAL_UJIAN:"soal/soal-berdasarkan-ujian/",

  MATERI_SISWA : "materi-siswa/",
  BUAT_UJIAN : "buat-ujian/",

  GET_UJIAN : "buat-ujian/",
  GET_ACTIVE_EXAM:"buat-ujian/ujian/aktif/",
  UPDATE_SOAL:"soal/update/",

  IKUT_UJIAN:"ikut-ujian/create",

  //get
  GET_USERS : "users/",
  GET_ORGANIZATION: "organisasi/",
  GET_MATERI: "materi/",
  GET_SEMESTER: "semester/",

  CREATE_ORGANIZATION: "organisasi/create/",
  CREATE_MATERI: "materi/tambah/",
  CREATE_SEMESTER: "semester/",
  
  CREATE_QUIZ: "buat-soal/create",
  CREATE_QUIZ_BY_UPLOAD: "buat-soal/upload",
  CREATE_QUIZ_MANUAL:"buat-soal/manual",

  CREATE_USER: "users/create",
  CREATE_USER_BY_ADMIN: "users/create",
//
  
  //update
  // UPDATE_MATERI: "materi/edit/",

  //delete
  DELETE_USER: "users/delete",
};

const STORAGE_KEYS = {
  ORGANIZATION: "organization",
};

export { MESSAGES, API_ENDPOINTS, STORAGE_KEYS };