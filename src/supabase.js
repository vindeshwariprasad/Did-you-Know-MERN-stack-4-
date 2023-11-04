import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzujwjkmfbzsojtbdany.supabase.co";
const supabaseKey =
  "your key";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
