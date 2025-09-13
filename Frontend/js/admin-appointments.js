const API_BASE_URL = "http://localhost:8080/api/v1/appointments";
const tableBody = document.getElementById("adminAppointmentTableBody");
const paginationEl = document.getElementById("pagination");

let allAppointments = [];      // Master copy
let filteredAppointments = []; // For filtering
let currentPage = 1;
const rowsPerPage = 10;

// Headers
function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Fetch all appointments
async function fetchAdminAppointments() {
  try {
    const res = await fetch(`${API_BASE_URL}/getall`, {
      method: "GET",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    allAppointments = result.data || [];
    filteredAppointments = [...allAppointments]; // Initially, no filter
    currentPage = 1;
    displayTable();
    setupPagination();
  } catch (err) {
    console.error("Error fetching appointments:", err);
  }
}

// Display table for current page
function displayTable() {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredAppointments.slice(start, end);

  paginatedItems.forEach(app => {
    tableBody.innerHTML += `
      <tr id="appointment-${app.id}">
        <td>${app.id}</td>
        <td>${app.userEmail}</td>
        <td>${app.serviceName}</td>
        <td>${app.price}</td>
        <td>${app.bookingDate}</td>
        <td>${app.appointmentTime}</td>
        <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-success" onclick="updateStatus(${app.id})">
            <i class="fas fa-check"></i> Status
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteAppointment(${app.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// Pagination setup
function setupPagination() {
  paginationEl.innerHTML = "";
  const pageCount = Math.ceil(filteredAppointments.length / rowsPerPage);
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = i === currentPage ? "active" : "";
    li.innerHTML = `<a onclick="goToPage(${i})">${i}</a>`;
    paginationEl.appendChild(li);
  }
}

function goToPage(page) {
  currentPage = page;
  displayTable();
  setupPagination();
}

// Search by email
function searchByEmail() {
  const email = document.getElementById("searchEmail").value.toLowerCase();
  filteredAppointments = allAppointments.filter(app =>
    app.userEmail.toLowerCase().includes(email)
  );
  currentPage = 1;
  displayTable();
  setupPagination();
}

// Reset filter
function resetSearch() {
  filteredAppointments = [...allAppointments];
  currentPage = 1;
  displayTable();
  setupPagination();
}

// Update status
async function updateStatus(id) {
  const { value: status } = await Swal.fire({
    title: "Update Appointment Status",
    input: "select",
    inputOptions: { Confirmed: "Approve", Cancelled: "Decline" },
    inputPlaceholder: "Select status",
    showCancelButton: true,
    confirmButtonText: "Update"
  });

  if (!status) return;

  try {
    const res = await fetch(`${API_BASE_URL}/status/${id}?status=${status}`, {
      method: "PATCH",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const badge = document.querySelector(`#appointment-${id} .status-badge`);
    badge.textContent = status;
    badge.className = `status-badge status-${status.toLowerCase()}`;
    Swal.fire("Updated!", `Appointment ${status === 'Confirmed' ? 'approved' : 'declined'}.`, "success");

    // Also update in arrays
    allAppointments.forEach(a => { if(a.id === id) a.status = status; });
    filteredAppointments.forEach(a => { if(a.id === id) a.status = status; });
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", "Failed to update status.", "error");
  }
}

// Delete appointment
async function deleteAppointment(id) {
  const confirmed = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  });
  if (!confirmed.isConfirmed) return;

  try {
    const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    Swal.fire("Deleted!", "Appointment removed.", "success");
    allAppointments = allAppointments.filter(app => app.id !== id);
    filteredAppointments = filteredAppointments.filter(app => app.id !== id);
    displayTable();
    setupPagination();
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", "Failed to delete appointment.", "error");
  }
}

// Initial load
window.onload = fetchAdminAppointments;
