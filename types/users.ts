export type AdminUserManagement = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: "ADMIN" | "USER";
  phone: string | null;
  dob?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
};
