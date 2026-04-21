const getToday = _ => {
  const d = new Date();
  const formatted = d.getFullYear() +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    ('0' + d.getDate()).slice(-2);
  return formatted; // YYYYMMDD format
};

const getDayBehind = day => {
  const d = new Date();
  d.setDate(d.getDate() - day);
  const formatted = d.getFullYear() +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    ('0' + d.getDate()).slice(-2);
  return formatted;
};

export { getToday, getDayBehind };