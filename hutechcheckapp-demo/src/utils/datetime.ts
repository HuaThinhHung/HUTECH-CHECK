export const getFullDateOf = (value: Date) => {
  const date = new Date(value);
  let day: any = date.getDate();
  let month: any = date.getMonth() + 1;
  const year = date.getFullYear();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return day + "/" + month + "/" + year;
};
