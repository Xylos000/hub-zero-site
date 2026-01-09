const supabase = window.supabase.createClient(
  "https://zjvyemxehxnitjxyvzvv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdnllbXhlaHhuaXRqeHl2enZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTQyOTksImV4cCI6MjA4MzUzMDI5OX0.rdlJVFPGmHpGnzpCtyRcAYJR-hS1_pBuwtz1VDI81wk"
);

const authDiv = document.getElementById("auth");
const chatArea = document.getElementById("chatArea");
const messagesDiv = document.getElementById("messages");

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

function randomColor() {
  const colors = ["#60a5fa", "#38bdf8", "#818cf8", "#22d3ee", "#93c5fd"];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    alert("Username can only contain letters, numbers, and underscores.");
    return;
  }

  const email = `${username}@hub-zero.local`;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username,
    color: randomColor()
  });

  alert("Account created. Log in now.");
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const email = `${username}@hub-zero.local`;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  startChat();
}

async function startChat() {
  authDiv.classList.add("hidden");
  chatArea.classList.remove("hidden");
  loadMessages();

  supabase
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      payload => addMessage(payload.new)
    )
    .subscribe();
}

async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at");

  messagesDiv.innerHTML = "";
  data.forEach(addMessage);
}

function addMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<span style="color:${msg.color}">${msg.username}</span>: ${msg.content}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const content = document.getElementById("messageInput").value.trim();
  if (!content) return;

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username,color")
    .eq("id", user.id)
    .single();

  await supabase.from("messages").insert({
    user_id: user.id,
    username: profile.username,
    color: profile.color,
    content
  });

  document.getElementById("messageInput").value = "";
}

supabase.auth.getSession().then(({ data }) => {
  if (data.session) startChat();
});
