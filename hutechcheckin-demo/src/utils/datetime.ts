export const formatDate = (value: Date) => {
  const date = new Date(value);
  let day: any = date.getDate();
  let month: any = date.getMonth() + 1;
  const year = date.getFullYear();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return day + "/" + month + "/" + year;
};

export const formatTime = (value: Date) => {
  const time = new Date(value);
  let hours: any = time.getHours();
  let minutes: any = time.getMinutes();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  return hours + ":" + minutes;
};

export const formatDateTime = (value: Date, mid?: string) => {
  return formatDate(value) + (mid ? ` ${mid} ` : " ") + formatTime(value);
};
