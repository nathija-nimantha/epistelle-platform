import { createClient } from "@/utils/supabase/server";

/**
 * Add user details to the "users" table in Supabase.
 *
 * @param userId - The ID of the user from Supabase Auth.
 * @param name - The name of the user.
 * @param email - The email of the user.
 * @returns An error if the insertion fails, otherwise null.
 */
export const addUserDetailsToTable = async (userId: string, name: string, email: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("users").insert({
    id: userId,
    name,
    email,
  });

  return error;
};
