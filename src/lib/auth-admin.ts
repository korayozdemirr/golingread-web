/**
 * Helper to verify whether an email address possesses administrator privileges.
 */
export function getAdminEmails(): string[] {
  const envList =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    process.env.ADMIN_EMAILS ||
    "test@gmail.com";

  return envList
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const list = getAdminEmails();
  return list.includes(clean);
}
