"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import {
  CreateUserType,
  CreateUserTypeResponse,
  Department,
  DepartmentResponse,
  Roletype,
  UserRoleResponse,
  UserType,
} from "@/types/staff";

const schema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

const userTypeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const loginSchema = z.object({
  username: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export type FormState = {
  message: string;
  success: boolean;
};

// API URL - replace with your actual API endpoint
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1/users";

const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  return token;
};

export async function registerCompanyUser(
  prevState: unknown,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsedData = schema.safeParse(formData);

  if (!parsedData.success) {
    return {
      message: "Invalid data",
      success: false,
    };
  }
  if (!parsedData.data.email) {
    return {
      message: "Email is required",
      success: false,
    };
  }

  try {
    // Make API call to register user
    const response = await fetch(`${API_URL}/company-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsedData.data.email,
        password: parsedData.data.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // API returned an error
      return {
        message: data.message || "Registration failed",
        success: false,
      };
    }

    // Don't redirect inside the try block - return instead
    return { message: "Registration successful", success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        message: error.message,
        success: false,
      };
    }

    return {
      message: "Failed to register. Please try again.",
      success: false,
    };
  }
}

export async function loginUser(
  previousState: unknown,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsedData = loginSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      message: "Invalid data",
      success: false,
    };
  }
  try {
    const apiFormData = new FormData();
    apiFormData.append("username", parsedData.data.username);
    apiFormData.append("password", parsedData.data.password);
    // Make API call to login user
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      body: apiFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      // API returned an error
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }
    // Store the token in a cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    const token = cookieStore.get("access_token");

    return {
      success: true,
      message: "Login Successful",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        message: "Validation failed",
        // errors: error.errors,
      };
    }

    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

// Utility function to check if user is authenticated
export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    return false;
  }

  try {
    // Verify token with API
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}

// Logout function
export async function logoutUser() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
  });
  const cookieStore = await cookies();
  cookieStore.delete("token");

  redirect("/auth/login");
}

// Get the current user
export async function getCurrentUser(): Promise<UserType | null> {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        user: null,
        error: "Not authenticated",
      };
    }

    // Make API request to get user profile
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle unauthorized or other errors
      if (response.status === 401) {
        // Clear the invalid token
        cookieStore.delete(token);
        return { user: null, error: "Session expired" };
      }
      return { user: null, error: "Failed to fetch user" };
    }

    const userData = await response.json();
    return { user: userData, error: null };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return { user: null, error: "An error occurred" };
  }
}

// Create User type
export async function createUserType(
  previousState: unknown,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsedData = userTypeSchema.safeParse(formData);

  const token = await getToken();

  if (!parsedData.success) {
    return {
      message: "Invalid data",
      success: false,
    };
  }
  if (!token) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  try {
    const response = await fetch(`${API_URL}/user-types`, {
      method: "POST",
      body: JSON.stringify({
        name: parsedData.data.name,
      }),
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // API returned an error
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }
    return {
      success: true,
      message: "User role created",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        message: "Validation failed",
        // errors: error.errors,
      };
    }

    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

// Fetch Role
export async function getCompanyUserRoles(): Promise<{
  roles: Roletype[] | null;
}> {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = await getToken();

    if (!token) {
      return {
        roles: null,
        error: "Not authenticated",
      };
    }

    console.log(token.value);

    // Make API request to get user profile
    const response = await fetch(`${API_URL}/user-types`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      return {
        roles: null,
        error: response.statusText,
      };
    }

    const roleData: Roletype[] = await response.json();
    return { roles: roleData, error: null };
  } catch (error) {
    return { roles: null, error: "An error occurred" };
  }
}

// Department
export async function createDepartment(
  previousState: unknown,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsedData = userTypeSchema.safeParse(formData);

  const token = await getToken();

  if (!parsedData.success) {
    return {
      message: "Invalid data",
      success: false,
    };
  }
  if (!token) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  try {
    const response = await fetch(`${API_URL}/company-departments`, {
      method: "POST",
      body: JSON.stringify({
        name: parsedData.data.name,
      }),
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // API returned an error
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }
    return {
      success: true,
      message: "Department role created",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        message: "Validation failed",
      };
    }

    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

// Fetch Departments
export async function getCompanyUserDeparments(): Promise<{
  departments: Department[] | null;
}> {
  try {
    // Get the token from cookies
    const token = await getToken();

    if (!token) {
      return {
        departments: null,
        error: "Not authenticated",
      };
    }

    console.log(token.value);

    // Make API request to get user profile
    const response = await fetch(`${API_URL}/company-departments`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      return {
        departments: null,
        error: response.statusText,
      };
    }

    const deptData: Department[] = await response.json();
    return { departments: deptData, error: null };
  } catch (error) {
    return { departments: null, error: "An error occurred" };
  }
}
