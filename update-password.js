/* =====================================================================
   ZAP MUDRA — update-password.js
   Handles entering a new password after clicking the reset link.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form            = document.getElementById("updateForm");
  const newPassInput    = document.getElementById("newPassword");
  const confirmPassInput= document.getElementById("confirmPassword");
  const errorBox        = document.getElementById("updateError");
  const successBox      = document.getElementById("updateSuccess");
  const submitBtn       = document.getElementById("updateSubmitBtn");

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
    submitBtn.textContent = loading ? "Please wait…" : (submitBtn.dataset.label || "Update Password");
  }

  // Supabase automatically logs the user in when they click the reset link.
  // We can immediately update their password.

  form.addEventListener("submit", async e => {
    e.preventDefault();
    errorBox.style.display = "none";
    successBox.style.display = "none";
    
    const newPass = newPassInput.value;
    const confirmPass = confirmPassInput.value;

    if (!newPass) {
      showError("Please enter a new password.");
      return;
    }
    if (newPass !== confirmPass) {
      showError("Passwords do not match.");
      return;
    }
    if (newPass.length < 6) {
      showError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPass
    });
    
    setLoading(false);
    
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Your password has been successfully updated! Redirecting to dashboard...");
      newPassInput.value = "";
      confirmPassInput.value = "";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    }
  });
});
