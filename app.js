async function checkBackend() {
  const statusEl = document.getElementById("backendStatus");
  const infoEl = document.getElementById("backendInfo");
  const systemEl = document.getElementById("systemStatus");

  try {
    const response = await sigapFetch("/api/health");
    const result = await response.json();

    if (!response.ok || result.status !== "ok") {
      throw new Error("Backend tidak sehat");
    }

    if (statusEl) {
      statusEl.textContent = "ONLINE";
    }

    if (infoEl) {
      infoEl.textContent =
        `SIGAP.ID API v${result.version || "2.0.0"} aktif`;
    }

    if (systemEl) {
      systemEl.textContent = "Terhubung";
    }

  } catch (error) {
    console.error("SIGAP.ID Backend:", error);

    if (statusEl) {
      statusEl.textContent = "OFFLINE";
    }

    if (infoEl) {
      infoEl.textContent = "Server SIGAP.ID tidak dapat dihubungi.";
    }

    if (systemEl) {
      systemEl.textContent = "Terputus";
    }
  }
}

function refreshData() {
  checkBackend();

  if (typeof loadEarthquakes === "function") {
    loadEarthquakes();
  }

  if (typeof loadAlerts === "function") {
    loadAlerts();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  checkBackend();

  const refreshButton = document.getElementById("refreshBtn");

  if (refreshButton) {
    refreshButton.addEventListener("click", refreshData);
  }
});
