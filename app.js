const supabase = window.supabase.createClient(
  "https://zjvyemxehxnitjxyvzvv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdnllbXhlaHhuaXRqeHl2enZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTQyOTksImV4cCI6MjA4MzUzMDI5OX0.rdlJVFPGmHpGnzpCtyRcAYJR-hS1_pBuwtz1VDI81wk"
);

const authBox = document.getElementById("auth-box");
const chatBox = document.getElementById("chat-box");
const messagesDiv = document.getElementById("messages");

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

/* AUTH */
async function signUp() {
  const username = username.value.trim();
  const password = password.value;
  const email = `${username}@hub-zero.local`;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Account created. You can now log in.");
}

async function logIn() {
  const username = username.value.trim();
  const password = password.value;
  const email = `${username}@hub-zero.local`;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  startChat();
}

async function logOut() {
  await supabase.auth.signOut();
  chatBox.classList.add("hidden");
  authBox.classList.remove("hidden");
}

/* CHAT */
async function startChat() {
  authBox.classList.add("hidden");
  chatBox.classList.remove("hidden");
  messagesDiv.innerHTML = "";
  loadMessages();

  supabase.channel("messages")
    .on("postgres_changes", { event: "INSERT", table: "messages" },
      payload => addMessage(payload.new)
    ).subscribe();
}

async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at");

  data.forEach(addMessage);
}

function addMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = `${msg.username}: ${msg.content}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

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

/* AUTO LOGIN */
supabase.auth.onAuthStateChange((_, session) => {
  if (session) startChat();
});
