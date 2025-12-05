<!-- components/sections/MapboxSection.vue -->
<template>
  <section class="bg-[#DDDDDD]">
    <div class="relative overflow-hidden">
      <div
        ref="mapContainer"
        id="map"
        class="w-full"
        style="width: 100%; height: 400px"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const mapContainer = ref(null);
let map = null;

// Add Mapbox resources to head
useHead({
  link: [
    {
      href: "https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css",
      rel: "stylesheet",
    },
  ],
  script: [
    {
      src: "https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js",
    },
  ],
});

onMounted(() => {
  // Wait for script to load then initialize
  if (window.mapboxgl) {
    initializeMap();
  } else {
    // Poll for mapboxgl to be available
    const checkMapbox = setInterval(() => {
      if (window.mapboxgl) {
        clearInterval(checkMapbox);
        initializeMap();
      }
    }, 100);
  }
});

const initializeMap = () => {
  if (!window.mapboxgl || !mapContainer.value) return;

  // Set access token
  window.mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFtbWFwYm94ODAiLCJhIjoiY202OWVkMmVlMGFycDJxcGhiem1zczAxcCJ9.miO8DfPKQ55x8YWgmnO_lg";

  // Initialize map
  map = new window.mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/bammapbox80/cmirha9kq001i01qvh99fe3uo", // Use standard style to avoid layer errors
    projection: "globe",
    zoom: 12,
    center: [4.246948039185497, 51.06909246639246], // Sint-Amands coordinates
  });

  // Add navigation controls
  map.addControl(new window.mapboxgl.NavigationControl());

  // Disable scroll zoom
  map.scrollZoom.disable();

  // Set fog on style load
  map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
  });

  // Create custom marker element with logo
  const markerElement = document.createElement("div");
  markerElement.style.width = "40px";
  markerElement.style.height = "40px";
  markerElement.style.borderRadius = "50%";
  markerElement.style.backgroundColor = "#161616";
  markerElement.style.border = "3px solid white";
  markerElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  markerElement.style.display = "flex";
  markerElement.style.alignItems = "center";
  markerElement.style.justifyContent = "center";
  markerElement.style.cursor = "pointer";

  // Add logo to marker
  const logoImg = document.createElement("img");
  logoImg.src = "/assets/favicon/favicon-96x96.png";
  logoImg.style.width = "20px";
  logoImg.style.height = "20px";
  logoImg.style.filter = "brightness(0) invert(1)"; // Make logo white
  markerElement.appendChild(logoImg);

  // Add popup to marker
  const popup = new window.mapboxgl.Popup({
    offset: 25,
    closeButton: true,
    className: "custom-popup",
    focusAfterOpen: false, // Fix ARIA accessibility issue
  }).setHTML(`
    <div style="padding: 15px; text-align: center; font-family: 'Inter', sans-serif;">
      <strong style="color: #161616; font-size: 16px;"><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/dir//2890+Puurs-Sint-Amands,+Belgium/@51.0549371,4.1898912,13z/data=!4m18!1m8!3m7!1s0x47c3ecd33d06e815:0xde8ebf776f28e2bb!2s2890+Puurs-Sint-Amands,+Belgium!3b1!8m2!3d51.0558846!4d4.2338458!16s%2Fg%2F1tjrp449!4m8!1m0!1m5!1m1!1s0x47c3ecd33d06e815:0xde8ebf776f28e2bb!2m2!1d4.2338458!2d51.0558846!3e0?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D">SiteSynth</a></strong><br>
      <span style="color: #666; font-size: 13px; line-height: 1.4;">Meir 67<br>2890 Puurs-Sint-Amands<br>Belgium - 🇧🇪</span>
    </div>
  `);

  // Add marker to map with popup attached
  const marker = new window.mapboxgl.Marker(markerElement)
    .setLngLat([4.246948039185497, 51.06909246639246])
    .setPopup(popup)
    .addTo(map);

  // Globe rotation functionality
  const secondsPerRevolution = 240;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;

  let userInteracting = false;
  const spinEnabled = true;

  function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        // Slow spinning at higher zooms
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      // Smoothly animate the map over one second
      map.easeTo({
        center,
        duration: 1000,
        easing: (n) => n,
      });
    }
  }

  // Pause spinning on interaction
  map.on("mousedown", () => {
    userInteracting = true;
  });

  map.on("dragstart", () => {
    userInteracting = true;
  });

  // Resume spinning when interaction ends
  map.on("moveend", () => {
    spinGlobe();
  });

  // Start spinning
  spinGlobe();
};

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
/* Custom popup styles */
:global(.custom-popup .mapboxgl-popup-content) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0;
}

:global(.custom-popup .mapboxgl-popup-tip) {
  border-top-color: white;
}

:global(.custom-popup .mapboxgl-popup-close-button) {
  color: #666;
  font-size: 18px;
  padding: 5px 8px;
  right: 5px;
  top: 5px;
}

:global(.custom-popup .mapboxgl-popup-close-button:hover) {
  color: #161616;
  background-color: #f0f0f0;
}
</style>
