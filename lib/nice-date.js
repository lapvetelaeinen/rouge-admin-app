export function niceDate(dateString) {
  const inputDate = new Date(dateString);

  const days = [
    "Söndag",
    "Måndag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lördag",
  ];

  const months = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ];

  const dayName = days[inputDate.getDay()];
  const date = inputDate.getDate();
  const monthName = months[inputDate.getMonth()];

  const formattedDate = `${dayName} ${date} ${monthName}`;

  return formattedDate;
}
