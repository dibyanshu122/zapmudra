/* =====================================================================
   ZAP MUDRA — login.js (Supabase version)
   Handles Email+Password login and Google OAuth login.
   Loaded after supabase-config.js and auth.js.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form        = document.getElementById("loginForm");
  const emailInput  = document.getElementById("loginEmail");
  const passInput   = document.getElementById("loginPassword");
  const errorBox    = document.getElementById("loginError");
  const successBox  = document.getElementById("loginSuccess");
  const forgotLink  = document.getElementById("forgotPasswordLink");
  const submitBtn   = document.getElementById("loginSubmitBtn");

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    successBox.style.display = "none";
  }
  function showSuccess(msg) {
    successBox.textContent = msg;
    successBox.style.display = "block";
    errorBox.style.display = "none";
  }
  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? "Please wait…" : (btn.dataset.label || btn.textContent);
  }

  // Show success if coming from registration
  if (new URLSearchParams(location.search).get("registered") === "1") {
    showSuccess("Account created! Please check your email to verify, then log in.");
  }

  // ── Email + Password Login ──────────────────────────────────────────
  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorBox.style.display = "none";
    setLoading(submitBtn, true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email:    emailInput.value.trim(),
      password: passInput.value
    });

    setLoading(submitBtn, false);

    if (error) {
      showError(error.message);
      return;
    }

    // Removed email verification check.


    window.location.href = "dashboard.html";
  });



  // ── Auto-redirect if already logged in ────────────────────────────
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      window.location.href = "dashboard.html";
    }
  });
});
