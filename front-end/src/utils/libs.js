function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
const formatTime = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

const TahunAjaran = () => {
  const today = new Date();
  let startYear;

  if (today.getMonth() + 1 >= 7) {
    startYear = today.getFullYear();
  } else {
    startYear = today.getFullYear() - 1;
  }

  return `${startYear}/${startYear + 1}`;
};

export { capitalizeFirstLetter, formatTime, TahunAjaran };
