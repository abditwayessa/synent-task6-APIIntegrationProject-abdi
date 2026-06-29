const states = [
  "emptyState",
  "loadingState",
  "errorState",
  "sidebar",
  "mainContent",
];

function showState(activeIds) {
  states.forEach((id) => {
    const el = document.getElementById(id);
    if (activeIds.includes(id)) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

const form = document.getElementById("fetchForm");
const usernameInput = document.getElementById("usernameInput");

async function fetchProfile(username) {
  showState(["loadingState"]);
  document.getElementById("loadingText").textContent =
    `Fetching @${username}...`;

  try {
    const userRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
    );

    if (userRes.status === 404) throw { code: "not-found" };
    if (userRes.status === 403) throw { code: "rate-limited" };
    if (!userRes.ok) throw { code: "network" };

    const user = await userRes.json();

    document.getElementById("loadingText").textContent =
      `Loading repositories...`;
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`,
    );
    const repos = reposRes.ok ? await reposRes.json() : [];

    renderProfile(user, repos);
  } catch (err) {
    renderError(err.code || "network", username);
  }
}

function renderProfile(user, repos) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || user.login;
  document.getElementById("login").textContent = `@${user.login}`;
  document.getElementById("bio").textContent =
    user.bio || "This user has no bio.";
  document.getElementById("repoCount").textContent = user.public_repos;
  document.getElementById("followerCount").textContent = user.followers;
  document.getElementById("followingCount").textContent = user.following;
  document.getElementById("location").textContent = user.location || "Unknown";
  document.getElementById("profileLink").href = user.html_url;

  const repoList = document.getElementById("repoList");
  repoList.innerHTML = "";

  if (Array.isArray(repos) && repos.length > 0) {
    repos.forEach((repo) => {
      const card = document.createElement("a");
      card.className = "repo-card";
      card.href = repo.html_url;
      card.target = "_blank";

      const langColor = getLangColor(repo.language);

      card.innerHTML = `
          <div>
            <div class="repo-name">${escapeHtml(repo.name)}</div>
            <div class="repo-desc">${escapeHtml(repo.description || "No description provided.")}</div>
          </div>
          <div class="repo-meta">
            <span><span class="lang-dot" style="background: ${langColor}"></span>${escapeHtml(repo.language || "Plain Text")}</span>
            <span>⭐ ${repo.stargazers_count}</span>
            <span>🍴 ${repo.forks_count}</span>
          </div>
        `;
      repoList.appendChild(card);
    });
  } else {
    repoList.innerHTML =
      '<p style="color: var(--text-dim);">No public repositories found.</p>';
  }

  showState(["sidebar", "mainContent"]);
}

function renderError(code, username) {
  const lineEl = document.getElementById("errorLine");
  const hintEl = document.getElementById("errorHint");

  if (code === "not-found") {
    lineEl.textContent = `User '${username}' not found`;
    hintEl.textContent = "Please check the spelling and try again.";
  } else if (code === "rate-limited") {
    lineEl.textContent = "API rate limit exceeded";
    hintEl.textContent =
      "GitHub limits unauthenticated requests. Please try again in an hour.";
  } else {
    lineEl.textContent = "Connection Error";
    hintEl.textContent =
      "Could not reach GitHub API. Check your internet connection.";
  }
  showState(["errorState"]);
}

function getLangColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
  };
  return colors[lang] || "#8b949e";
}

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Handle input changes to reset state when cleared
usernameInput.addEventListener("input", () => {
  if (usernameInput.value.trim() === "") {
    showState(["emptyState"]);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();

  // If username is empty, just show the empty state and don't proceed
  if (!username) {
    showState(["emptyState"]);
    return;
  }

  fetchProfile(username);
});
