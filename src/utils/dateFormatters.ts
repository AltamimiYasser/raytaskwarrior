function parseDate(timestamp: string): Date {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hours = timestamp.substring(9, 11);
  const minutes = timestamp.substring(11, 13);
  const seconds = timestamp.substring(13, 15);
  const iso8601Timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  return new Date(iso8601Timestamp);
}

export const formatDate = (date: string) => {
  const dateObject = parseDate(date);

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    return `${((hours + 11) % 12) + 1}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  if (isToday(dateObject)) {
    return `Today at ${formatTime(dateObject)}`;
  } else if (isYesterday(dateObject)) {
    return `Yesterday at ${formatTime(dateObject)}`;
  } else {
    return dateObject.toLocaleDateString() + " at " + formatTime(dateObject);
  }
};
