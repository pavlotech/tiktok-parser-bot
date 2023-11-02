export default function isValidDate(dateString: string) {
  var pattern = /^\d{2}.\d{2}.\d{4}$/;
  
  if (!pattern.test(dateString)) return false;

  var parts = dateString.split(".");
  var month = parseInt(parts[0], 10);
  var day = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);
  
  if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  return true;
}