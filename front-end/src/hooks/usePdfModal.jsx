import { useContext, useEffect } from "react";
import { UserContext } from "../context/LayoutContext";

export const usePdfModal = () => {
  const { setOpenPDF } = useContext(UserContext);

  // Fungsi trigger notifikasi
  const openPdf = (url) => {
    if (!url) return;
    setOpenPDF(url);
  };

  // Bersihkan notif ketika komponen unmount
  useEffect(() => {
    return () => {
      setOpenPDF(null);
    };
  }, [setOpenPDF]);

  return { openPdf };
};
