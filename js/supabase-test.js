import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const el = document.getElementById("supabaseStatus");
el.textContent = "Testing Supabase…";

const { data, error } = await supabase.from("guilds").select("guild_id").limit(1);

if (error) el.textContent = "Supabase error: " + error.message;
else el.textContent = "Supabase OK ✅ (guilds rows: " + (data?.length ?? 0) + ")";
