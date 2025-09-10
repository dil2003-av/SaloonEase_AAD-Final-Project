const API_BASE_URL = "http://localhost:8080/api/v1/appointments";
const adminAppointmentTableBody = document.getElementById("adminAppointmentTableBody");

// Load appointments on page load
window.onload = fetchAdminAppointments;

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
    const appointments = result.data || [];

    adminAppointmentTableBody.innerHTML = "";
    appointments.forEach(app => {
      adminAppointmentTableBody.innerHTML += `
        <tr>
          <td>${app.id}</td>
          <td>${app.userEmail}</td>
          <td>${app.serviceName}</td>
          <td>${app.price}</td>
          <td>${app.bookingDate}</td>
          <td>${app.appointmentTime}</td>
          <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
          <td class="table-actions">
            <button class="btn btn-sm btn-outline-primary" onclick="changeStatus(${app.id})">
              <i class="fas fa-edit"></i> Status
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteAppointment(${app.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
  }
}

// Change appointment status
async function changeStatus(id) {
  const { value: status } = await Swal.fire({
    title: "Update Status",
    input: "select",
    inputOptions: {
      Pending: "Pending",
      Confirmed: "Confirmed",
      Completed: "Completed",
      Cancelled: "Cancelled"
    },
    inputPlaceholder: "Select status",
    showCancelButton: true
  });

  if (status) {
    try {
      const res = await fetch(`${API_BASE_URL}/status/${id}?status=${status}`, {
        method: "PATCH",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      Swal.fire("Updated!", "Appointment status updated.", "success");
      fetchAdminAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  }
}

// Delete appointment
async function deleteAppointment(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: "DELETE",
          headers: getHeaders()
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        Swal.fire("Deleted!", "Appointment removed.", "success");
        fetchAdminAppointments();
      } catch (err) {
        console.error("Error deleting appointment:", err);
        Swal.fire("Error!", "Failed to delete appointment.", "error");
      }
    }
  });
}
