const supabase = window.supabase.createClient(
  "https://zjvyemxehxnitjxyvzvv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdnllbXhlaHhuaXRqeHl2enZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTQyOTksImV4cCI6MjA4MzUzMDI5OX0.rdlJVFPGmHpGnzpCtyRcAYJR-hS1_pBuwtz1VDI81wk"
);

// ELEMENTS
const homeTab = document.getElementById("home");
const chatTab = document.getElementById("chat");

const authBox = document.getElementById("auth-box");
const chatBox = document.getElementById("chat-box");

const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

// ROUTING
function renderRoute() {
  const hash = window.location.hash || "#home";

  homeTab.style.display = hash === "#home" ? "block" : "none";
  chatTab.style.display = hash === "#chat" ? "block" : "none";
}

window.addEventListener("hashchange", renderRoute);
renderRoute();

// AUTH
async function signUp() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) return alert("Missing fields");

  const email = `${username}@hub-zero.local`;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Account created. Now log in.");
}

async function logIn() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const email = `${username}@hub-zero.local`;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  startChat();
}

async function logOut() {
  await supabase.auth.signOut();
  authBox.classList.remove("hidden");
  chatBox.classList.add("hidden");
}

// CHAT
async function startChat() {
  authBox.classList.add("hidden");
  chatBox.classList.remove("hidden");
  messagesDiv.innerHTML = "";

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at");

  data.forEach(addMessage);

  supabase.channel("messages")
    .on("postgres_changes", { event: "INSERT", table: "messages" },
      payload => addMessage(payload.new)
    ).subscribe();
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

// BUTTON WIRING (IMPORTANT)
document.getElementById("signupBtn").onclick = signUp;
document.getElementById("loginBtn").onclick = logIn;
document.getElementById("logoutBtn").onclick = logOut;
document.getElementById("sendBtn").onclick = sendMessage;

// AUTO LOGIN
supabase.auth.onAuthStateChange((_, session) => {
  if (session) startChat();
});
