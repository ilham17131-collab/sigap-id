async function loadEarthquakes() {
  const magnitudeEl = document.getElementById("earthquakeMag");
  const infoEl = document.getElementById("earthquakeInfo");

  try {
    const response = await sigapFetch("/api/earthquakes");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("API gempa gagal");
    }

    const earthquakes = Array.isArray(result.data)
      ? result.data
      : [];

    if (earthquakes.length === 0) {
      if (magnitudeEl) magnitudeEl.textContent = "—";
      if (infoEl) infoEl.textContent = "Belum ada data gempa.";
      return;
    }

    const latest = earthquakes[0];

    const magnitude = Number(latest.magnitude);

    const magText = Number.isFinite(magnitude)
      ? `M ${magnitude.toFixed(1)}`
      : "—";

    const location = latest.location || "Lokasi tidak tersedia";
    const depth = latest.depth_km ?? "—";
    const date = latest.date || "";
    const time = latest.time || "";
    const potential = latest.potential || "";

    if (magnitudeEl) {
      magnitudeEl.textContent = magText;
    }

    if (infoEl) {
      infoEl.innerHTML =
        `${escapeHtml(location)}<br>` +
        `Kedalaman ${escapeHtml(String(depth))} km<br>` +
        `${escapeHtml(date)} • ${escapeHtml(time)}<br>` +
        `${escapeHtml(potential)}`;
    }

  } catch (error) {
    console.error("SIGAP.ID Gempa:", error);

    if (magnitudeEl) {
      magnitudeEl.textContent = "—";
    }

    if (infoEl) {
      infoEl.textContent = "Gagal memuat data gempa.";
    }
  }
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


document.addEventListener(
  "DOMContentLoaded",
  loadEarthquakes
);
