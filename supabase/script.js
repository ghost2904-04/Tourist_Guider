// Replace these with your Supabase project credentials
const SUPABASE_URL = "https://vqwluoknbmaqohyxyzxt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxd2x1b2tuYm1hcW9oeXh5enh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzYyMjcsImV4cCI6MjA3MzQ1MjIyN30.sIJl3jahN5RGQUW9f-auyI9N3xTgjKezAtB9k0SSLRM";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Signup function
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await db.auth.signUp({ email, password });
  if (error) {
    alert("Signup error: " + error.message);
  } else {
    alert("Signup successful! Check your email for confirmation.");
    // You usually keep them on login page until email confirmed
  }
}

// Login function
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login failed: " + error.message);
  } else {
    const user = data.user;  // ✅ get logged in user

    if (user) {
      // ✅ Save userId so chatbot.html can use it
      localStorage.setItem("userId", user.id);

      // ✅ Redirect to chatbot
      window.location.href = "chatbot.html";
    } else {
      alert("No user returned from Supabase!");
    }
  }
}


const resetEmail = document.getElementById('reset-email');
const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', async () => {
  const { data, error } = await db.auth.resetPasswordForEmail(
    resetEmail.value,
    {
      redirectTo: 'http://localhost:5500/reset.html' // 👈 page user will be sent to
    }
  );

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Password reset link sent! Check your email.");
  }
});

// Logout function
async function logout() {
  await db.auth.signOut();
  document.getElementById("auth").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}
