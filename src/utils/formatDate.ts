export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-CA");
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour12: false,
  });
  return `${formattedDate} ${formattedTime}`;
};
