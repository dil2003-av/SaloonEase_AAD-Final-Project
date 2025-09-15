// const API_BASE_URL = "http://localhost:8080/api/v1/appointments";
// const PAYMENTS_API_URL = "http://localhost:8080/api/v1/payments";

// const appointmentForm = document.getElementById("appointmentForm");
// const appointmentTableBody = document.querySelector("#appointmentTable tbody");
// const editModal = new bootstrap.Modal(document.getElementById("editAppointmentModal"));
// const editForm = document.getElementById("editAppointmentForm");

// let appointments = [];
// let editingId = null;

// // Load appointments on page load
// window.onload = fetchAppointments;

// // Helper: get headers (with token if needed)
// function getHeaders() {
//     const token = localStorage.getItem("token");
//     const headers = { "Content-Type": "application/json" };
//     if (token) headers["Authorization"] = `Bearer ${token}`;
//     return headers;
// }

// // Fetch and render appointments
// async function fetchAppointments() {
//     try {
//         const res = await fetch(`${API_BASE_URL}/getall`, { method: "GET", headers: getHeaders() });
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         const result = await res.json();
//         appointments = result.data || [];

//         appointmentTableBody.innerHTML = "";
//         appointments.forEach(app => {
//             appointmentTableBody.innerHTML += `
//                 <tr>
//                     <td>${app.userEmail}</td>
//                     <td>${app.serviceName}</td>
//                     <td>${app.price.toFixed(2)}</td>
//                     <td>${app.bookingDate}</td>
//                     <td>${app.appointmentTime}</td>
//                     <td>${app.status}</td>
//                     <td>${app.notes || ""}</td>
//                     <td>
//                         <button class="btn btn-sm btn-warning" onclick="editAppointment(${app.id})">Edit</button>
//                         <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${app.id})">Delete</button>
//                         ${app.status === "Confirmed" ? 
//                             `<button class="btn btn-sm btn-success" onclick="payNow(${app.id}, ${app.price}, '${app.serviceName}')">Pay Now</button>` 
//                             : ""}
//                     </td>
//                 </tr>
//             `;
//         });
//     } catch (err) {
//         console.error("Error fetching appointments:", err);
//         Swal.fire("Error!", "Failed to load appointments. Check console for details.", "error");
//     }
// }

// // PayNow function
// window.payNow = (appointmentId, amount, serviceName) => {
//     if (!amount || isNaN(amount) || amount <= 0) {
//         Swal.fire("Error!", "Invalid payment amount.", "error");
//         return;
//     }

//     const data = {
//         sandbox: true,
//         merchant_id: "1231987",
//         return_url: `${window.location.origin}/payments/success`,
//         cancel_url: `${window.location.origin}/payments/cancel`,
//         notify_url: "http://localhost:8080/api/v1/payments/notify",
//         order_id: appointmentId.toString(),
//         items: serviceName || "Service Payment",
//         currency: "LKR",
//         amount: parseFloat(amount.toFixed(2)),
//         first_name: "Customer",
//         last_name: "",
//         email: "customer@example.com",
//         phone: "0771234567",
//         address: "",
//         city: "",
//         country: "Sri Lanka"
//     };

//     // Submit dynamically
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "https://sandbox.payhere.lk/pay/checkout";

//     for (let key in data) {
//         const input = document.createElement("input");
//         input.type = "hidden";
//         input.name = key;
//         input.value = data[key];
//         form.appendChild(input);
//     }

//     document.body.appendChild(form);
//     form.submit();
// };

// // Create new appointment
// appointmentForm.onsubmit = async (e) => {
//     e.preventDefault();
//     const price = parseFloat(document.getElementById("price").value);
//     if (isNaN(price) || price <= 0) {
//         Swal.fire("Error!", "Please enter a valid price.", "error");
//         return;
//     }

//     const data = {
//         userEmail: document.getElementById("customerEmail").value,
//         serviceName: document.getElementById("service").value,
//         price: price,
//         bookingDate: document.getElementById("bookingDate").value,
//         appointmentTime: document.getElementById("appointmentTime").value,
//         status: document.getElementById("status").value,
//         notes: document.getElementById("notes").value
//     };

//     try {
//         const res = await fetch(`${API_BASE_URL}/create`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         const result = await res.json();
//         Swal.fire("Created!", result.data || "Appointment booked successfully", "success");
//         appointmentForm.reset();
//         fetchAppointments();
//     } catch (err) {
//         console.error("Error creating appointment:", err);
//         Swal.fire("Error!", "Failed to create appointment.", "error");
//     }
// };

// // Edit appointment
// window.editAppointment = (id) => {
//     const app = appointments.find(a => a.id === id);
//     if (!app) return;
//     editingId = id;
//     document.getElementById("editCustomerEmail").value = app.userEmail;
//     document.getElementById("editService").value = app.serviceName;
//     document.getElementById("editPrice").value = app.price;
//     document.getElementById("editBookingDate").value = app.bookingDate;
//     document.getElementById("editAppointmentTime").value = app.appointmentTime;
//     document.getElementById("editStatus").value = app.status;
//     document.getElementById("editNotes").value = app.notes || "";
//     editModal.show();
// };

// // Save changes from edit modal
// editForm.onsubmit = async (e) => {
//     e.preventDefault();
//     if (!editingId) return;
//     const price = parseFloat(document.getElementById("editPrice").value);
//     if (isNaN(price) || price <= 0) {
//         Swal.fire("Error!", "Please enter a valid price.", "error");
//         return;
//     }

//     const data = {
//         id: editingId,
//         userEmail: document.getElementById("editCustomerEmail").value,
//         serviceName: document.getElementById("editService").value,
//         price: price,
//         bookingDate: document.getElementById("editBookingDate").value,
//         appointmentTime: document.getElementById("editAppointmentTime").value,
//         status: document.getElementById("editStatus").value,
//         notes: document.getElementById("editNotes").value
//     };

//     try {
//         const res = await fetch(`${API_BASE_URL}/update`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         const result = await res.json();
//         Swal.fire("Updated!", result.data || "Appointment updated successfully", "success");
//         editModal.hide();
//         fetchAppointments();
//         editingId = null;
//     } catch (err) {
//         console.error("Error updating appointment:", err);
//         Swal.fire("Error!", "Failed to update appointment.", "error");
//     }
// };

// // Delete appointment
// window.deleteAppointment = async (id) => {
//     Swal.fire({
//         title: "Are you sure?",
//         text: "You won’t be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!"
//     }).then(async (result) => {
//         if (result.isConfirmed) {
//             try {
//                 const res = await fetch(`${API_BASE_URL}/delete/${id}`, { method: "DELETE", headers: getHeaders() });
//                 if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//                 Swal.fire("Deleted!", "Appointment deleted successfully", "success");
//                 fetchAppointments();
//             } catch (err) {
//                 console.error("Error deleting appointment:", err);
//                 Swal.fire("Error!", "Failed to delete appointment.", "error");
//             }
//         }
//     });
// };



const API_BASE_URL = "http://localhost:8080/api/v1/appointments";
const PAYMENTS_API_URL = "http://localhost:8080/api/v1/payments";

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
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

// Fetch and render appointments
async function fetchAppointments() {
    try {
        const res = await fetch(`${API_BASE_URL}/getall`, { method: "GET", headers: getHeaders() });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const result = await res.json();
        appointments = result.data || [];

        appointmentTableBody.innerHTML = "";
        appointments.forEach(app => {
            let actionButtons = `
                <button class="btn btn-sm btn-warning btn-edit" onclick="editAppointment(${app.id})">Edit</button>
                <button class="btn btn-sm btn-danger btn-delete" onclick="deleteAppointment(${app.id})">Delete</button>
            `;

            if (app.status === "Confirmed") {
                actionButtons += `<button class="btn btn-sm btn-success" onclick="payNow(${app.id})">Pay Now</button>`;
            } else if (app.status === "Paid") {
                actionButtons += `<button class="btn btn-sm btn-secondary" disabled>Paid</button>`;
            }

            appointmentTableBody.innerHTML += `
                <tr id="appointment-${app.id}">
                    <td>${app.userEmail}</td>
                    <td>${app.serviceName}</td>
                    <td>${app.price.toFixed(2)}</td>
                    <td>${app.bookingDate}</td>
                    <td>${app.appointmentTime}</td>
                    <td>${app.status}</td>
                    <td>${app.notes || ""}</td>
                    <td>${actionButtons}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error fetching appointments:", err);
        Swal.fire("Error!", "Failed to load appointments. Check console for details.", "error");
    }
}

// ===========================
// PayHere Payment Function
// ===========================
async function payNow(appointmentId) {
    console.log("Starting payment for appointment ID:", appointmentId);

    if (typeof payhere === 'undefined') {
        Swal.fire("Payment Error", "PayHere library is not loaded. Please wait.", "error");
        return;
    }

    try {
        // Step 1: Test Hash from backend
        const hashRes = await fetch(`${PAYMENTS_API_URL}/test-hash/${appointmentId}`, {
            method: "GET",
            headers: getHeaders()
        });

        if (!hashRes.ok) {
            const errData = await hashRes.json();
            throw new Error(errData.error || "Hash test failed");
        }

        const hashData = await hashRes.json();
        console.log("Hash data:", hashData);

        // Step 2: Fetch full PayHere form data
        const formRes = await fetch(`${PAYMENTS_API_URL}/create-payhere/${appointmentId}`, {
            method: "POST",
            headers: getHeaders()
        });

        if (!formRes.ok) {
            const errData = await formRes.json();
            throw new Error(errData.error || "Failed to create PayHere form data");
        }

        const paymentData = await formRes.json();
        console.log("PayHere form data:", paymentData);

        // Step 3: Prepare PayHere object
        const payment = {
            sandbox: paymentData.sandbox === "1",
            merchant_id: paymentData.merchant_id,
            return_url: paymentData.return_url || `${window.location.origin}/payment-success.html`,
            cancel_url: paymentData.cancel_url || `${window.location.origin}/payment-cancel.html`,
            notify_url: paymentData.notify_url || `${PAYMENTS_API_URL}/notify`,
            order_id: paymentData.order_id,
            items: paymentData.items,
            amount: parseFloat(paymentData.amount).toFixed(2),
            currency: paymentData.currency || "LKR",
            hash: paymentData.hash,
            first_name: paymentData.first_name,
            last_name: paymentData.last_name,
            email: paymentData.email || "no-reply@example.com",
            phone: paymentData.phone || "0000000000",
            address: paymentData.address || "Colombo",
            city: paymentData.city || "Colombo",
            country: paymentData.country || "Sri Lanka"
        };

        // PayHere event handlers
        payhere.onCompleted = async function(orderId) {
            console.log("Payment completed:", orderId);
            Swal.fire("Payment Successful", `Order ID: ${orderId}`, "success");

            // Update appointment status to Paid in backend
            try {
                const res = await fetch(`${API_BASE_URL}/update-status/${appointmentId}`, {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify({ status: "Paid" })
                });
                if (!res.ok) throw new Error("Failed to update appointment status");
                fetchAppointments(); // Refresh table, now button will show "Paid"
            } catch (err) {
                console.error("Error updating status to Paid:", err);
            }
        };

        payhere.onDismissed = function() {
            console.log("Payment dismissed by user");
            Swal.fire("Payment Cancelled", "You closed the payment window.", "warning");
        };

        payhere.onError = function(error) {
            console.error("Payment error:", error);
            Swal.fire("Payment Error", typeof error === "string" ? error : "Unknown error occurred", "error");
        };

        // Start the PayHere popup
        payhere.startPayment(payment);

    } catch (err) {
        console.error("Error initiating payment:", err);
        Swal.fire("Error!", err.message || "Unable to initiate payment.", "error");
    }
}

// ===============================
// CRUD Functions for Appointments
// ===============================

// Create new appointment
appointmentForm.onsubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(document.getElementById("price").value);
    if (isNaN(price) || price <= 0) {
        Swal.fire("Error!", "Please enter a valid price.", "error");
        return;
    }

    const data = {
        userEmail: document.getElementById("customerEmail").value,
        serviceName: document.getElementById("service").value,
        price: price,
        bookingDate: document.getElementById("bookingDate").value,
        appointmentTime: document.getElementById("appointmentTime").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/create`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
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
    const price = parseFloat(document.getElementById("editPrice").value);
    if (isNaN(price) || price <= 0) {
        Swal.fire("Error!", "Please enter a valid price.", "error");
        return;
    }

    const data = {
        id: editingId,
        userEmail: document.getElementById("editCustomerEmail").value,
        serviceName: document.getElementById("editService").value,
        price: price,
        bookingDate: document.getElementById("editBookingDate").value,
        appointmentTime: document.getElementById("editAppointmentTime").value,
        status: document.getElementById("editStatus").value,
        notes: document.getElementById("editNotes").value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/update`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
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
                const res = await fetch(`${API_BASE_URL}/delete/${id}`, { method: "DELETE", headers: getHeaders() });
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
