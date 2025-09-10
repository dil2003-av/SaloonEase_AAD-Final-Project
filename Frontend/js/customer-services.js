const API_BASE_URL = "http://localhost:8080/api/services";
const servicesContainer = document.getElementById("servicesContainer");
let services = [];

// Fetch services on page load
window.onload = fetchServices;

async function fetchServices() {
  try {
    const token = localStorage.getItem("token"); // if your API requires token
    const res = await fetch(`${API_BASE_URL}/getall`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    services = result.data;

    renderServices(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    servicesContainer.innerHTML = "<p class='text-danger'>Failed to load services.</p>";
  }
}

// Render service cards
function renderServices(serviceList) {
  servicesContainer.innerHTML = "";
  serviceList.forEach(service => {
    const card = document.createElement("div");
    card.className = "col-lg-4 col-md-6 service-category " + getCategoryClass(service.name);
    card.innerHTML = `
      <div class="service-card">
        <img src="${service.imageUrl.startsWith('http') ? service.imageUrl : 'http://localhost:8080' + service.imageUrl}" 
             class="service-img" 
             alt="${service.name}">
        <div class="card-body">
          <h5 class="card-title">${service.name}</h5>
          <p class="card-text">${service.description}</p>
          <p class="mb-1"><strong>Price:</strong> $${service.price}</p>
          <p class="mb-2"><i class="fas fa-clock"></i> ${service.duration}</p>
          <button class="btn btn-primary book-btn" 
                  data-service="${service.name}" 
                  data-price="$${service.price}">
            Book Now
          </button>
        </div>
      </div>
    `;
    servicesContainer.appendChild(card);
  });

  // Add booking functionality
  document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', () => {
      const service = button.getAttribute('data-service');
      const price = button.getAttribute('data-price');
      const url = `customer-appointment.html?service=${encodeURIComponent(service)}&price=${encodeURIComponent(price)}`;
      window.location.href = url;
    });
  });
}


// Simple category assignment function
function getCategoryClass(name) {
  name = name.toLowerCase();
  if (name.includes("hair")) return "hair";
  if (name.includes("facial")) return "facial";
  if (name.includes("body") || name.includes("massage") || name.includes("wax")) return "body";
  if (name.includes("nail") || name.includes("manicure") || name.includes("pedicure")) return "nails";
  return "other";
}

// Category filter functionality
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');
    document.querySelectorAll('.service-category').forEach(card => {
      if (filter === 'all' || card.classList.contains(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
