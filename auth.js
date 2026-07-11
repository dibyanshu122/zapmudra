/* =====================================================================
   ZAP MUDRA — Shared Auth Logic (Supabase version)
   Replaces Firebase auth.js completely.
   Handles:
   - Navbar Login/Logout sync via supabase.auth.onAuthStateChange
   - Redirect memory (pre-login page remember)
   - Loan/credit-card tile click gating (logged-out → login)
   - Email verification check
   ===================================================================== */

const ZapAuth = (() => {
  const REDIRECT_KEY = "zm_postLoginRedirect";

  function rememberCurrentPage() {
    sessionStorage.setItem(REDIRECT_KEY, location.href);
  }

  function consumeRedirect() {
    const target = sessionStorage.getItem(REDIRECT_KEY) || "index.html";
    sessionStorage.removeItem(REDIRECT_KEY);
    return target;
  }

  function goToLogin() {
    rememberCurrentPage();
    location.href = "login.html";
  }

  function renderAuthUI(user) {
    const el = document.getElementById("navAuth");
    if (!el) return;

    if (user) {
      const meta = user.user_metadata || {};
      const name = (meta.full_name || meta.name || user.email || "Account").split(" ")[0];
      el.innerHTML = `
        <span class="nav-user">Hi, ${name}</span>
        <a class="btn btn-ghost" href="dashboard.html" id="navDashBtn">My Dashboard</a>
        <button class="btn btn-ghost" id="navLogoutBtn" type="button">Logout</button>`;
      
      const applyBtn = document.getElementById("navApplyBtn");
      if (applyBtn) applyBtn.style.display = "none";
      const navLinks = document.getElementById("navLinks");
      if (navLinks) navLinks.style.display = "none";
      const navPhone = document.getElementById("navPhone");
      if (navPhone) navPhone.style.display = "none";

      document.getElementById("navLogoutBtn").addEventListener("click", async () => {
        await supabase.auth.signOut();
        location.href = "index.html";
      });
    } else {
      el.innerHTML = `<a class="btn btn-ghost" href="login.html" id="navLoginBtn">Login</a>`;
      const applyBtn = document.getElementById("navApplyBtn");
      if (applyBtn) applyBtn.style.display = "inline-flex";
      const navLinks = document.getElementById("navLinks");
      if (navLinks) navLinks.style.display = "flex";
      const navPhone = document.getElementById("navPhone");
      if (navPhone) navPhone.style.display = "inline-flex";
      
      document.getElementById("navLoginBtn").addEventListener("click", rememberCurrentPage);
    }
  }

  /* Gate loan/credit-card tile clicks — logged-out users go to login */
  function gateOfferClicks() {
    document.querySelectorAll("#creditCardGrid, #loanGrid").forEach(grid => {
      grid.addEventListener("click", async e => {
        const card = e.target.closest(".partner-card");
        if (!card) return;

        // PREVENT DEFAULT SYNCHRONOUSLY to stop the browser from following the link before our async check finishes
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          goToLogin();
          return;
        }

        // Removed email verification check.
        const user = session.user;

        // If they click a teaser card on the home page while logged in,
        // redirect them to the dashboard instead of the partner link.
        // Partner links are only accessible on the dashboard itself.
        if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
          window.location.href = "dashboard.html";
          return;
        }

        // Track click in Supabase (only happens on dashboard now)
        const linkId = card.dataset.linkId;
        const href = card.href || card.dataset.href;

        if (linkId) {
          try {
            await supabase.from("link_clicks").insert({
              user_id: user.id,
              loan_link_id: parseInt(linkId)
            });
          } catch (_) { /* non-blocking */ }
        }

        // Navigate manually since we prevented default
        if (href && href !== "#") {
          window.open(href, "_blank", "noopener,noreferrer");
        }
      });
    });
  }

  // Watch auth state changes globally
  supabase.auth.onAuthStateChange((_event, session) => {
    renderAuthUI(session?.user || null);
  });

  document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabase.auth.getSession();
    renderAuthUI(session?.user || null);
    gateOfferClicks();
  });

  return { goToLogin, consumeRedirect, rememberCurrentPage, renderAuthUI };
})();
