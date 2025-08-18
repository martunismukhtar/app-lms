import React from 'react';
import Alert from './Alert';

const Notif = () => {
  return (
    <div>
      <Alert type="success" message="Data berhasil disimpan" duration={2000} />
      <Alert type="error" message="Terjadi kesalahan saat menyimpan data" duration={5000} />
      <Alert type="warning" message="Peringatan: data tidak lengkap" duration={1000} />
    </div>
  );
};

export default Notif;