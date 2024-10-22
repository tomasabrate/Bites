const formatDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) {
    throw new TypeError("El argumento debe ser un objeto Date válido");
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Sumar 1 porque los meses son 0-indexados
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Formato YYYY-MM-DD
};

export default formatDate;
