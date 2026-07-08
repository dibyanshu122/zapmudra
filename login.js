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
  const googleBtn   = document.getElementById("googleLoginBtn");
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

    // Check email verified
    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      showError("Please verify your email before logging in. Check your inbox.");
      return;
    }

    window.location.href = "dashboard.html";
  });

  // ── Google OAuth Login ─────────────────────────────────────────────
  googleBtn.addEventListener("click", async () => {
    errorBox.style.display = "none";
    // Save redirect target before OAuth redirect
    ZapAuth.rememberCurrentPage();
    // Store where to go after login in localStorage (survives redirect)
    const target = sessionStorage.getItem("zm_postLoginRedirect") || "index.html";
    localStorage.setItem("zm_oauth_redirect", target);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard.html"
      }
    });
    if (error) showError(error.message);
  });



  // ── Auto-redirect if already logged in ────────────────────────────
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user?.email_confirmed_at) {
      window.location.href = "dashboard.html";
    }
  });
});
