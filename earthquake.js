// SIGAP.ID — Earthquake data

async function loadEarthquakes() {
  const card =
    document.querySelector("[data-earthquake]") ||
    document.getElementById("earthquake") ||
    document.querySelector(".earthquake-card");

  try {
    const response = await sigapFetch("/api/earthquakes");
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error("Earthquake API error");
    }

    const list = Array.isArray(payload.data) ? payload.data : [];
    const latest = list[0];

    if (!latest) {
      setEarthquakeText(card, "Belum ada data gempa.");
      return;
    }

    const magnitude = Number(latest.magnitude);
    const magText = Number.isFinite(magnitude)
      ? magnitude.toFixed(1)
      : "—";

    const depth = latest.depth_km ?? "—";
    const location = latest.location || "Lokasi tidak tersedia";
    const date = latest.date || "";
    const time = latest.time || "";
    const potential = latest.potential || "";

    const html = `
      <div class="eq-main">
        <div class="eq-magnitude">M ${escapeHtml(magText)}</div>
        <div class="eq-location">${escapeHtml(location)}</div>
      </div>

      <div class="eq-meta">
        <span>Kedalaman ${escapeHtml(String(depth))} km</span>
        <span>${escapeHtml(date)}${date && time ? " • " : ""}${escapeHtml(time)}</span>
      </div>

      <div class="eq-potential">
        ${escapeHtml(potential)}
      </div>
    `;

    if (card) {
      card.innerHTML = html;
    } else {
      const mag = document.querySelector("[data-earthquake-magnitude]");
      const loc = document.querySelector("[data-earthquake-location]");
      const meta = document.querySelector("[data-earthquake-meta]");
      const pot = document.querySelector("[data-earthquake-potential]");

      if (mag) mag.textContent = `M ${magText}`;
      if (loc) loc.textContent = location;
      if (meta) {
        meta.textContent =
          `Kedalaman ${depth} km • ${date} • ${time}`;
      }
      if (pot) pot.textContent = potential;
    }

  } catch (error) {
    console.error("SIGAP.ID earthquake error:", error);
    setEarthquakeText(card, "Data gempa belum dapat dimuat.");
  }
}

function setEarthquakeText(card, text) {
  if (card) {
    card.textContent = text;
    return;
  }

  const loc = document.querySelector("[data-earthquake-location]");
  if (loc) loc.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", loadEarthquakes);
