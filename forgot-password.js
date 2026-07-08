/* =====================================================================
   ZAP MUDRA — forgot-password.js
   Handles password reset requests.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("resetForm");
  const emailInput = document.getElementById("resetEmail");
  const errorBox   = document.getElementById("resetError");
  const successBox = document.getElementById("resetSuccess");
  const submitBtn  = document.getElementById("resetSubmitBtn");

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
  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Please wait…" : (submitBtn.dataset.label || "Send Reset Link");
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorBox.style.display = "none";
    successBox.style.display = "none";
    
    const email = emailInput.value.trim();
    if (!email) {
      showError("Please enter your email address.");
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password.html"
    });
    
    setLoading(false);
    
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Password reset email sent! Please check your inbox (and spam folder) to reset your password.");
      emailInput.value = "";
    }
  });
});
