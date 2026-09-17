-- ─── 1. CREATE USED NONCES TABLE (ANTI-REPLAY DEFENSE) ───
CREATE TABLE IF NOT EXISTS public.used_script_nonces (
  nonce text PRIMARY KEY,
  student_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on used_script_nonces (blocks all direct client access)
ALTER TABLE public.used_script_nonces ENABLE ROW LEVEL SECURITY;

-- ─── 2. CREATE STUDENT SCRIPT KEYS TABLE ───
CREATE TABLE IF NOT EXISTS public.student_script_keys (
  student_id text PRIMARY KEY,
  student_name text,
  ep_key text,
  ss_key text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on student_script_keys (blocks all direct client access)
ALTER TABLE public.student_script_keys ENABLE ROW LEVEL SECURITY;

-- ─── 3. AUTO-MIGRATE ALL EXISTING VERIFIED STUDENTS ───
INSERT INTO public.student_script_keys (student_id, student_name, ep_key, ss_key, is_active)
SELECT 
  id, 
  name, 
  encode(gen_random_bytes(24), 'hex'),
  encode(gen_random_bytes(24), 'hex'),
  true
FROM public.verified_students
ON CONFLICT (student_id) DO NOTHING;

-- ─── 4. CREATE ATOMIC CLAIM RPC FUNCTION ───
CREATE OR REPLACE FUNCTION public.claim_secure_script(
  p_student_id text,
  p_domain text,
  p_timestamp bigint,
  p_nonce text,
  p_signature text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now_ms bigint;
  v_script_id text;
  v_payload text;
BEGIN
  -- Basic parameter validation
  IF p_student_id IS NULL OR p_student_id = '' OR p_nonce IS NULL OR p_nonce = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required parameters');
  END IF;

  -- 1. Timestamp freshness check (60s tolerance for client clock skew)
  v_now_ms := (EXTRACT(EPOCH FROM now()) * 1000)::bigint;
  IF abs(v_now_ms - p_timestamp) > 60000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request timestamp expired or out of sync');
  END IF;

  -- 2. Nonce replay check & burn
  IF EXISTS (SELECT 1 FROM public.used_script_nonces WHERE nonce = p_nonce) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Nonce replay detected');
  END IF;

  INSERT INTO public.used_script_nonces (nonce, student_id, created_at)
  VALUES (p_nonce, p_student_id, now());

  -- Housekeeping: purge nonces older than 10 minutes
  DELETE FROM public.used_script_nonces WHERE created_at < now() - interval '10 minutes';

  -- 3. Check if student is blacklisted
  IF EXISTS (SELECT 1 FROM public.blacklisted_students WHERE id = p_student_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Account suspended by administrator');
  END IF;

  -- 4. Check if student is verified
  IF NOT EXISTS (SELECT 1 FROM public.verified_students WHERE id = p_student_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unverified Hub Zero student');
  END IF;

  -- Auto-provision student_script_keys if not present
  INSERT INTO public.student_script_keys (student_id, student_name, ep_key, ss_key, is_active)
  SELECT p_student_id, (SELECT name FROM public.verified_students WHERE id = p_student_id), encode(gen_random_bytes(24), 'hex'), encode(gen_random_bytes(24), 'hex'), true
  ON CONFLICT (student_id) DO NOTHING;

  -- Check if student license is active
  IF EXISTS (SELECT 1 FROM public.student_script_keys WHERE student_id = p_student_id AND is_active = false) THEN
    RETURN jsonb_build_object('success', false, 'error', 'License revoked');
  END IF;

  -- 5. Determine target script ID based on domain
  IF p_domain ILIKE '%stpatricks%' OR p_domain ILIKE '%schoolbox%' THEN
    v_script_id := 'student_search_script';
  ELSE
    v_script_id := 'ep_hub_script';
  END IF;

  -- 6. Fetch encrypted script from admin_vault
  SELECT payload INTO v_payload FROM public.admin_vault WHERE id = v_script_id;

  IF v_payload IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Script vault item not found');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'script_id', v_script_id,
    'payload', v_payload
  );
END;
$$;

-- ─── 5. PERMISSIONS LOCKDOWN ───
GRANT EXECUTE ON FUNCTION public.claim_secure_script(text, text, bigint, text, text) TO anon, authenticated, service_role;
REVOKE ALL ON TABLE public.used_script_nonces FROM anon;
REVOKE ALL ON TABLE public.student_script_keys FROM anon;
