/*  =================
    Global Variables
    =================
*/

document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.backgroundColor = "#2D5EC2"; // Set background color
document.body.style.paddingBottom = "20px"; // Space for bottom bar

// Creates an empty array to store the map markers representing disaster events
const disasterMarkers = [];
  
// Maps Country names to their coordinates and default zoom levels
const countryCenters = {
  //Format: "Country Name": { center: [lng, lat], zoom: (bigger number means zoomed in more)}
  "Antigua and Barbuda": { center: [-61.7964, 17.0608], zoom: 11.2 },
  "Bahamas": { center: [-77.3963, 25.0343], zoom: 7 },
  "Barbados": { center: [-59.5432, 13.1939], zoom: 11.2 },
  "Belize": { center: [-88.4976, 17.1899], zoom: 7 },
  "British Virgin Islands": { center: [-64.6231, 18.4314], zoom: 11 },
  "Cayman Islands": { center: [-81.2546, 19.3133], zoom: 10 },
  "Cuba": { center: [-79.3832, 21.5218], zoom: 7 },
  "Dominica": { center: [-61.3700, 15.4150], zoom: 11 },
  "Dominican Republic": { center: [-70.1627, 18.7357], zoom: 7 },
  "Grenada": { center: [-61.6789, 12.1165], zoom: 11 },
  "Guadeloupe": { center: [-61.5510, 16.2650], zoom: 10 },
  "Guyana": { center: [-58.9302, 4.8604], zoom: 6.5 },
  "Haiti": { center: [-72.2852, 18.9712], zoom: 8 },
  "Jamaica": { center: [-77.2975, 18.1096], zoom: 9 },
  "Martinique": { center: [-61.0200, 14.6400], zoom: 10 },
  "Puerto Rico": { center: [-66.5901, 18.2208], zoom: 9 },
  "Saint Kitts and Nevis": { center: [-62.782998, 17.357822], zoom: 11.2 },
  "Saint Lucia": { center: [-60.9789, 13.9094], zoom: 11.2 },
  "Saint Vincent and the Grenadines": { center: [-61.2872, 13.2528], zoom: 11 },
  "Suriname": { center: [-55.2038, 3.9193], zoom: 6.5 },
  "Trinidad and Tobago": { center: [-61.2225, 10.6918], zoom: 9 },
  "Turks and Caicos Islands": { center: [-71.1419, 21.6940], zoom: 9 },
};
  
// Creates an array that contains all country names
const countries = Object.keys(countryCenters);
  
// List of Caribbean countries for filtering GDACS alerts for Caribbean events
const caribbeanCountries = countries;


/*==============
  MapBox Setup
================*/

const Mapbox_Token = 'pk.eyJ1IjoiZGVhbmdlbG9jb3ppZXIiLCJhIjoiY204dmVlcWE3MHdibjJrcTFsNDM2NnRvZCJ9.VldME1nw7rgxxFFtenrMGw';
mapboxgl.accessToken = Mapbox_Token;
      
// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-59.6, 13.1],
  minZoom: 5,
  maxZoom: 20
});
  
/*  ==================
    Reusable Functions
  ==================*/
 
// Create a styled Dom element
function createStyledElement(type, styles, attributes = {}) {
  const el = document.createElement(type);
  Object.assign(el.style, styles);
  for (const [key, val] of Object.entries(attributes)) el[key] = val;
  return el;
}
    
// Helper function: choose marker color by alert level
function getAlertColor(level) {
  switch (level?.toLowerCase()) {
    case "green": return "green";
    case "orange": return "orange";
    case "red": return "red";
    default: return "gray";
  }
}
    
// Zoom map to a country and toggle marker visibility
function focusOnCountry(selectedCountry) {
  const location = countryCenters[selectedCountry];
    if (location) {
      map.flyTo({ center: location.center, zoom: location.zoom, essential: true });
    }
  
    disasterMarkers.forEach(({ marker, country }) => {
      if (country === selectedCountry) {
        marker.getElement().style.display = "block";
      } else {
        marker.getElement().style.display = "none";
      }
    });
}
  
// GDACS Map short disaster codes and this converts them to full names
const eventTypeMap = {
    EQ: "Earthquake",
    TC: "Tropical Cyclone",
    FL: "Flood",
    VO: "Volcano",
    DR: "Drought",
    WF: "Wildfire",
    OT: "Other"
};
  
/*===================
    UI Event Bindings
  ======================
*/

// Use elements already in the HTML
const filterContainer = document.getElementById("filterContainer");
const filterWrapper = document.getElementById("filterWrapper");
const dropdownBox = document.getElementById("dropdownBox");
const filterBtn = document.getElementById("filterBtn");
const resetBtn = document.getElementById("resetBtn");

      
filterBtn.addEventListener("click", e => {
    e.stopPropagation();  // Prevent outside click listener from firing
    dropdownBox.style.display = dropdownBox.style.display === "flex" ? "none" : "flex";
});

//  Close if clicked outside
document.addEventListener("click", e => {
  if (!filterWrapper.contains(e.target)) {
    dropdownBox.style.display = "none";
  }
});

resetBtn.addEventListener("click", () => {
  map.flyTo({
    center: [-70.0, 17.5],
    zoom: 4.5,
    essential: true
  });

    // Show all disaster markers
    disasterMarkers.forEach(({ marker }) => {
      marker.getElement().style.display = "block";
    }); 
});

countries.forEach(country => {
  const item = createStyledElement("div", {
    cursor: "pointer", padding: "5px 8px", borderRadius: "4px",
    transition: "background-color 0.2s", userSelect: "none"
  }, { textContent: country });

  item.addEventListener("mouseover", () => item.style.backgroundColor = "#f0f0f0"); // Hover effect
  item.addEventListener("mouseout", () => item.style.backgroundColor = "transparent"); 
  item.addEventListener("click", () => { // Click Effect 
    focusOnCountry(country);
    dropdownBox.style.display = "none"; // Hide the box after selection
  });

  dropdownBox.appendChild(item);
});
  
  // Create the Message Icon Button
  /*const messageButton = createStyledElement("div", {
      position: "fixed", bottom: "35px", right: "20px", cursor: "pointer", zIndex: "11", //Style the container to be invisible and just wrap the image
      backgroundColor: "transparent", width: "auto", height: "auto", display: "inline-block" // No background, border, or padding
    }, { title: "Send us a message" }); 
    
    // Create the image
    const iconImg = createStyledElement("img", {
      width: "40px", height: "40px", pointerEvents: "none"
    }, { src: "MessageBox.png", alt: "Message Icon" });
    
    messageButton.appendChild(iconImg); // Add the image to the button
    messageButton.addEventListener("click", () => alert("Message button clicked!")); // Add click behavior to the container
    document.body.appendChild(messageButton); // Add to the page */
  
  
  // Countries to show and add its own clickable element
  
  

    
/*  =====================
    Load Disaster Alerts
    =====================*/
  
// Add zoom + rotation controls  
map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
// Shows the user that the alerts are being loaded 
const alertList = document.getElementById("alertList"); 
alertList.innerHTML = '<li style="color: gray;">Loading alerts...</li>';

async function fetchGDACSAlerts() {
  const alertList = document.getElementById("alertList");
  
  // Clear old markers
  disasterMarkers.forEach(({ marker }) => marker.remove());
  disasterMarkers.length = 0;
  
  try {
    const response = await fetch("https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP");
    const data = await response.json();
  
    const alerts = data.features || [];
  
    alertList.innerHTML = ""; // Clears the alert list only once, right after fetching
  
    // Filter Caribbean alerts
    const caribbeanAlerts = alerts.filter(event =>
      caribbeanCountries.includes(event.properties.country)
    );
  
    let displayAlerts = [];

    if (caribbeanAlerts.length > 0) {
          // Show Caribbean alerts first
          displayAlerts = [...caribbeanAlerts];

        // Then add global alerts not already included
        const globalAlerts = alerts.filter(event =>
        !caribbeanCountries.includes(event.properties.country)
      );

      displayAlerts = [...displayAlerts, ...globalAlerts];

} else {
  // No Caribbean alerts found — show global only and display a notice
  const notice = document.createElement("li");
  notice.textContent = "⚠️ No current Caribbean alerts. Displaying global disasters only.";
  notice.style.fontWeight = "bold";
  notice.style.color = "#cc0000";
  alertList.appendChild(notice);

  displayAlerts = alerts;
}
  
    const seen = new Set();
  
    displayAlerts.forEach(event => {
      let { eventtype, country, alertlevel, fromdate } = event.properties;
      const coords = event.geometry?.coordinates;
      country = country || "Offshore"; // If there is no country attached, set the country to 'Offshore'
  
      const readableDate = new Date(fromdate).toLocaleString();
      const type = eventTypeMap[eventtype] || eventtype || "Unknown Disaster";
  
      const key = `${type}-${country}-${readableDate}`;
      if (seen.has(key)) return;
      seen.add(key);

  
      // Add to alert list
      const li = document.createElement("li");
      li.textContent = `${type} - ${country} - ${alertlevel} - ${readableDate}`;
      alertList.appendChild(li);
  
      // Add marker to map
      if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        coords.every(c => typeof c === "number" && !isNaN(c))
      ) { 
        // Add marker
        const el = document.createElement("div");
        el.style.backgroundColor = getAlertColor(alertlevel);
        el.style.width =  "40px";
        el.style.height = "40px";
        el.style.borderRadius = "50%";
  
        const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(
            new mapboxgl.Popup({ offset: 20 }).setHTML(`
              <strong>${type}</strong><br>${country}<br>
              <span style="color:${getAlertColor(alertlevel)};">Alert Level: ${alertlevel}</span><br>
              ${readableDate}
          `)
        )
      .addTo(map);
  
      disasterMarkers.push({ marker, country });
      }
    });
  
  } catch (error) {
    console.error("Error fetching GDACS alerts:", error);
    alertList.innerHTML = "<li>Error loading alerts. Please try again later.</li>";
  }
}
  
fetchGDACSAlerts();
setInterval(fetchGDACSAlerts, 60000);

/*================
  Scroll Animation
  =================*/
const disasterHero = document.getElementById("disaster-hero");
  
window.addEventListener("scroll", () => {
  if (disasterHero) {
    disasterHero.classList.toggle("shrink", window.scrollY > 50);
  }
});
  

/*=======================
  Live Search in Alerts
  ========================*/
document.getElementById("searchAlerts").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll("#alertList li").forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(term) ? "block" : "none";
  });
});
