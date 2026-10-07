async function loadEarthquakes() {
  const magnitudeEl = document.getElementById("earthquakeMag");
  const infoEl = document.getElementById("earthquakeInfo");

  try {
    const response = await sigapFetch("/api/earthquakes");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("API gempa gagal");
    }

    const earthquakes = result.data || [];

    if (earthquakes.length === 0) {
      magnitudeEl.textContent = "—";
      infoEl.textContent = "Belum ada data gempa.";
      return;
    }

    const latest = earthquakes[0];

    magnitudeEl.textContent =
      "M " + Number(latest.magnitude).toFixed(1);

    infoEl.innerHTML =
      latest.location + "<br>" +
      "Kedalaman " + latest.depth_km + " km<br>" +
      latest.date + " • " + latest.time + "<br>" +
      latest.potential;

  } catch (error) {
    console.error(error);

    magnitudeEl.textContent = "—";
    infoEl.textContent = "Gagal memuat data gempa.";
  }
}

document.addEventListener("DOMContentLoaded", loadEarthquakes);
