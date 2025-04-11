export const ROLES = {
  PUBLIC: "public",
  ADMIN: "admin",
  MODERATOR: "moderator",
  STUDENT: "scholar",
  TEACHER: "teacher",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
