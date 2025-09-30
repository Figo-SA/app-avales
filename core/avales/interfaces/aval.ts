export interface Aval {
  id: string;
  title: string;
  description: string;
  status: "sent" | "pending" | "approved" | "rejected";
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
