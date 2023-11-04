import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzujwjkmfbzsojtbdany.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6dWp3amttZmJ6c29qdGJkYW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3ODYzMjAsImV4cCI6MjAxNDM2MjMyMH0.K12U7OzLKjQs8NKbGd-_OagxxmFMj8NBD7BJa7DI1Gk";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
