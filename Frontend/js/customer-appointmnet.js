const API_BASE_URL = "http://localhost:8080/api/v1/appointments";

const appointmentForm = document.getElementById("appointmentForm");
const appointmentTableBody = document.querySelector("#appointmentTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editAppointmentModal"));
const editForm = document.getElementById("editAppointmentForm");

let appointments = [];
let editingId = null;

// Load appointments on page load
window.onload = fetchAppointments;

// Helper: get headers (with token if needed)
function getHeaders() {
    const token = localStorage.getItem("token"); // if backend uses JWT
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

// Fetch and render appointments
async function fetchAppointments() {
    try {
        const res = await fetch(`${API_BASE_URL}/getall`, {
            method: "GET",
            headers: getHeaders()
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const result = await res.json();
        appointments = result.data || [];

        appointmentTableBody.innerHTML = "";
        appointments.forEach(app => {
            appointmentTableBody.innerHTML += `
                <tr>
                    <td>${app.userEmail}</td>
                    <td>${app.serviceName}</td>
                    <td>${app.price}</td>
                    <td>${app.bookingDate}</td>
                    <td>${app.appointmentTime}</td>
                    <td>${app.status}</td>
                    <td>${app.notes || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editAppointment(${app.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${app.id})">Delete</button>
                        ${
                            app.status === "Confirmed" 
                            ? `<button class="btn btn-sm btn-success" onclick="payNow(${app.id}, ${app.price})">Pay Now</button>` 
                            : ""
                        }
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error fetching appointments:", err);
        Swal.fire("Error!", "Failed to load appointments. Check console for details.", "error");
    }
}

// PayNow function
window.payNow = (id, amount) => {
    // You can integrate PayHere or any other payment here
    // Example: redirect to PayHere checkout page
    const data = {
        merchant_id: "YOUR_MERCHANT_ID",
        return_url: "http://localhost:5500/customer/appointment.html",
        cancel_url: "http://localhost:5500/customer/appointment.html",
        notify_url: "http://localhost:8080/api/v1/payments/notify",
        order_id: id,
        items: `Appointment ${id}`,
        currency: "LKR",
        amount: amount,
        first_name: "Customer",
        last_name: "",
        email: "customer@example.com",
        phone: "0771234567",
        address: "",
        city: "",
        country: "Sri Lanka"
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payhere.lk/pay/checkout";

    for (let key in data) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
};


// Create new appointment
appointmentForm.onsubmit = async (e) => {
    e.preventDefault();

    const data = {
        userEmail: document.getElementById("customerEmail").value,
        serviceName: document.getElementById("service").value,
        price: parseFloat(document.getElementById("price").value),
        bookingDate: document.getElementById("bookingDate").value,
        appointmentTime: document.getElementById("appointmentTime").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const result = await res.json();
        Swal.fire("Created!", result.data || "Appointment booked successfully", "success");
        appointmentForm.reset();
        fetchAppointments();
    } catch (err) {
        console.error("Error creating appointment:", err);
        Swal.fire("Error!", "Failed to create appointment.", "error");
    }
};

// Edit appointment
window.editAppointment = (id) => {
    const app = appointments.find(a => a.id === id);
    if (!app) return;

    editingId = id;
    document.getElementById("editCustomerEmail").value = app.userEmail;
    document.getElementById("editService").value = app.serviceName;
    document.getElementById("editPrice").value = app.price;
    document.getElementById("editBookingDate").value = app.bookingDate;
    document.getElementById("editAppointmentTime").value = app.appointmentTime;
    document.getElementById("editStatus").value = app.status;
    document.getElementById("editNotes").value = app.notes || "";
    editModal.show();
};

// Save changes from edit modal
editForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const data = {
        id: editingId,
        userEmail: document.getElementById("editCustomerEmail").value,
        serviceName: document.getElementById("editService").value,
        price: parseFloat(document.getElementById("editPrice").value),
        bookingDate: document.getElementById("editBookingDate").value,
        appointmentTime: document.getElementById("editAppointmentTime").value,
        status: document.getElementById("editStatus").value,
        notes: document.getElementById("editNotes").value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/update`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const result = await res.json();
        Swal.fire("Updated!", result.data || "Appointment updated successfully", "success");
        editModal.hide();
        fetchAppointments();
        editingId = null;
    } catch (err) {
        console.error("Error updating appointment:", err);
        Swal.fire("Error!", "Failed to update appointment.", "error");
    }
};

// Delete appointment
window.deleteAppointment = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
                    method: "DELETE",
                    headers: getHeaders()
                });

                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

                Swal.fire("Deleted!", "Appointment deleted successfully", "success");
                fetchAppointments();
            } catch (err) {
                console.error("Error deleting appointment:", err);
                Swal.fire("Error!", "Failed to delete appointment.", "error");
            }
        }
    });
};
