export default function reverseDateFormat(dateString: string) {
  const [month, day, year] = dateString.split('/');
  return `${month}.${day}.${year}`;
}