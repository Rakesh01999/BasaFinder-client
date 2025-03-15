// export interface IUser {
//   userId: string;
//   name: string;
//   email: string;
//   hasShop?: boolean;
//   isActive?: boolean;
//   role: "user" | "admin";
//   iat?: number;
//   exp?: number;
// }

// export interface IUser {
//   userId: string;
//   name: string;
//   email: string;
//   role: "admin" | "landlord" | "tenant"; // ✅ Fixed Role
//   hasShop?: boolean;
//   isActive?: boolean;
//   iat?: number;
//   exp?: number;
// }


export interface IUser {
  userId: string;
  name: string;
  email: string;
  password: string;
  profileImg?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'landlord' | 'tenant'; // 🔹 Updated Roles
  status?: 'active' | 'blocked';
  isBlocked: boolean;
  isDeleted: boolean;
}