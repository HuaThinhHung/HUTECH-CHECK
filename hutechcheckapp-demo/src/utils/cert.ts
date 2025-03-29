export const formatCertNumber = (num: number, length: number): string => {
  let formatted = num.toString();
  while (formatted.length < length) {
    formatted = "0" + formatted;
  }
  return formatted;
};

export const getCertYear = (date: any) => {
  let cefYear: string;

  const mocNgay = 18;
  const mocThang = 7;

  const string = new Date(date);
  const ngay = string.getDate();
  const thang = string.getMonth() + 1;
  const nam = string.getFullYear().toString().slice(-2);

  if (ngay >= mocNgay && thang >= mocThang) {
    cefYear = `${nam}${Number(nam) + 1}`;
  } else {
    cefYear = `${Number(nam) - 1}${nam}`;
  }

  return cefYear;
};
