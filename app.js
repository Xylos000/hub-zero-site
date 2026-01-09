const supabase = window.supabase.createClient(
  "https://zjvyemxehxnitjxyvzvv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdnllbXhlaHhuaXRqeHl2enZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTQyOTksImV4cCI6MjA4MzUzMDI5OX0.rdlJVFPGmHpGnzpCtyRcAYJR-hS1_pBuwtz1VDI81wk"
);

// UI
const home = document.getElementById("home");
const chat = document.getElementById("chat");
const auth = document.getElementById("auth");
const chatBox = document.getElementById("chatBox");
const messagesDiv = document.getElementById("messages");

function showHome() {
  home.classList.remove("hidden");
  chat.classList.add("hidden");
}

function showChat() {
  home.classList.add("hidden");
  chat.classList.remove("hidden");
}

// AUTH
async function signUp() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const email = `${username}@hub-zero.local`;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Account created");
}

async function logIn() {
  const email = `${usernameInput.value.trim()}@hub-zero.local`;
  const password = passwordInput.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  startChat();
}

async function startChat() {
  auth.classList.add("hidden");
  chatBox.classList.remove("hidden");
}

// CHAT
async function sendMessage() {
  const content = messageInput.value.trim();
  if (!content) return;

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  await supabase.from("messages").insert({
    user_id: user.id,
    username: profile.username,
    content
  });

  messageInput.value = "";
}

async function logOut() {
  await supabase.auth.signOut();
  auth.classList.remove("hidden");
  chatBox.classList.add("hidden");
}
