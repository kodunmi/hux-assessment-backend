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
  Contacts: {
    // Add paths for contacts
    Base: "/contacts",
    Get: "/",
    Add: "/",
    Update: "/:id", // Include an ID parameter for updating
    Delete: "/:id",
    GetOne: "/:phoneNumber", // Include an email parameter for getting one by email
  },
} as const;
