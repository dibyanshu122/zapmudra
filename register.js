/* =====================================================================
   ZAP MUDRA — register.js (Supabase version)
   Handles Email+Password registration and Google OAuth sign-up.
   Loaded after supabase-config.js and auth.js.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form        = document.getElementById("registerForm");
  const nameInput   = document.getElementById("regName");
  const emailInput  = document.getElementById("regEmail");
  const mobileInput = document.getElementById("regMobile");
  const passInput   = document.getElementById("regPassword");
  const confirmInput= document.getElementById("regConfirm");
  const errorBox    = document.getElementById("registerError");
  const successBox  = document.getElementById("registerSuccess");
  const googleBtn   = document.getElementById("googleRegisterBtn");
  const submitBtn   = document.getElementById("registerSubmitBtn");

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    successBox.style.display = "none";
  }
  function showSuccess(msg) {
    successBox.innerHTML = msg;
    successBox.style.display = "block";
    errorBox.style.display = "none";
  }
  function setLoading(btn, loading, label) {
    btn.disabled = loading;
    btn.textContent = loading ? "Please wait…" : label;
  }

  // ── Email + Password Registration ──────────────────────────────────
  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorBox.style.display = "none";

    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mobile= mobileInput.value.trim();
    const pass  = passInput.value;
    const conf  = confirmInput.value;

    if (!name)         { showError("Please enter your full name."); return; }
    if (!mobile || mobile.length < 10) { showError("Please enter a valid 10-digit mobile number."); return; }
    if (pass !== conf) { showError("Passwords do not match."); return; }
    if (pass.length < 6) { showError("Password must be at least 6 characters."); return; }

    setLoading(submitBtn, true, "Create Account");

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name, phone: mobile },
        emailRedirectTo: window.location.origin + "/login.html"
      }
    });

    setLoading(submitBtn, false, "Create Account");

    if (error) {
      showError(error.message);
      return;
    }

    // Update profile name and phone in profiles table
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name,
        phone: mobile
      });
    }

    // Redirect directly to dashboard
    window.location.href = "dashboard.html";
  });

  // ── Google OAuth Sign-Up ───────────────────────────────────────────
  googleBtn.addEventListener("click", async () => {
    errorBox.style.display = "none";
    localStorage.setItem("zm_oauth_redirect", "dashboard.html");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard.html"
      }
    });
    if (error) showError(error.message);
  });
});
