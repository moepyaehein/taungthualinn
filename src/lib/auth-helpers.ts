/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Check if the current user is authenticated.
 * Returns the user object or null.
 */
export async function getAuthUser(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user's role from the profiles table.
 */
export async function getUserRole(supabase: any, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!data) return null;
  return (data as { role: string }).role;
}

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const role = await getUserRole(supabase, userId);
  return role === 'admin';
}
