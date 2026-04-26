export type SessionRole = "STUDENT" | "ORGANIZER" | "ADMIN";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: SessionRole;
};

export const SESSION_COOKIE_NAME = "ceh-session";

export function dashboardPathForRole(role: SessionRole) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "ORGANIZER":
      return "/organizer";
    case "STUDENT":
      return "/student";
  }
}

export function serializeSession(user: SessionUser) {
  return [
    encodeURIComponent(user.id),
    user.role,
    encodeURIComponent(user.email),
    encodeURIComponent(user.name),
  ].join(".");
}

export function deserializeSession(value?: string | null): SessionUser | null {
  if (!value) {
    return null;
  }

  const [id, role, email, name] = value.split(".");
  if (!id || !role || !email || !name) {
    return null;
  }

  if (role !== "STUDENT" && role !== "ORGANIZER" && role !== "ADMIN") {
    return null;
  }

  try {
    return {
      id: decodeURIComponent(id),
      role,
      email: decodeURIComponent(email),
      name: decodeURIComponent(name),
    };
  } catch {
    return null;
  }
}
