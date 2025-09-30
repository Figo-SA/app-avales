export type AvalStatus = "sent" | "pending" | "approved" | "rejected";

export const getStatusConfig = (status: AvalStatus) => {
  switch (status) {
    case "sent":
      return { label: "Enviado", step: 1, color: "#2196F3", icon: "ion:send" };
    case "pending":
      return {
        label: "En revisión",
        step: 2,
        color: "#FF9800",
        icon: "ion:eye",
      };
    case "approved":
      return {
        label: "Aceptado",
        step: 3,
        color: "#4CAF50",
        icon: "ion:checkmark-circle",
      };
    case "rejected":
      return {
        label: "Rechazado",
        step: 3,
        color: "#F44336",
        icon: "ion:close-circle",
      };
    default:
      return { label: "Enviado", step: 1, color: "#2196F3", icon: "ion:send" };
  }
};
