/**
 * Express router paths go here.
 */

export default {
  Base: "/api",
  Auth: {
    Base: "/auth",
    Login: "/login",
    Logout: "/logout",
    Register: "/register",
  },
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
} as const;
