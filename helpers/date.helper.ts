/**
 * Helpers para formateo de fechas
 */

/**
 * Formatea una fecha ISO a formato legible en español
 * Ejemplo: "2025-12-01T08:00:00.000Z" → "01/12/2025"
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formatea una fecha ISO a formato largo en español
 * Ejemplo: "2025-12-01T08:00:00.000Z" → "lunes, 01 de diciembre de 2025"
 */
export const formatDateLong = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formatea una fecha ISO con hora en español
 * Ejemplo: "2025-12-01T08:00:00.000Z" → "01 dic 2025, 08:00"
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formatea un rango de fechas
 * Ejemplo: "01 dic - 05 dic 2025"
 */
export const formatDateRange = (
  startDateString: string,
  endDateString: string
): string => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const startMonth = startDate.toLocaleDateString("es-ES", { month: "short" });
  const endMonth = endDate.toLocaleDateString("es-ES", { month: "short" });
  const year = endDate.getFullYear();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
};

/**
 * Obtiene el tiempo relativo (hace cuánto)
 * Ejemplo: "hace 2 días", "hace 3 horas"
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  }
  if (diffHours > 0) {
    return `hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  }
  if (diffMinutes > 0) {
    return `hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
  }
  return "hace un momento";
};
