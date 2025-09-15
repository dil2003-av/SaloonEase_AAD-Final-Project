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
            appointmentTableBody.innerHTML += `
                <tr>
                    <td>${app.userEmail}</td>
                    <td>${app.serviceName}</td>
                    <td>${app.price.toFixed(2)}</td>
                    <td>${app.bookingDate}</td>
                    <td>${app.appointmentTime}</td>
                    <td>${app.status}</td>
                    <td>${app.notes || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editAppointment(${app.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${app.id})">Delete</button>
                        ${app.status === "Confirmed" ? 
                            `<button class="btn btn-sm btn-success" onclick="payNow(${app.id})">Pay Now</button>` 
                            : ""}
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error fetching appointments:", err);
        Swal.fire("Error!", "Failed to load appointments. Check console for details.", "error");
    }
}

// PayNow function using PayHere popup
// async function payNow(appointmentId) {

//     console.log("Initiating payment for appointment ID:", appointmentId);

//     if (typeof payhere === 'undefined') {
//         Swal.fire("Payment Error", "PayHere library not loaded yet. Please wait and try again.", "error");
//         return;
//     }

//     try {
//         // Request payment data from backend
//         const res = await fetch(`${PAYMENTS_API_URL}/create-payhere/${appointmentId}`, {
//             method: "POST",
//             headers: getHeaders()
//         });
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         const result = await res.json();
//         const paymentData = result; // backend already returns map with all fields

//         console.log("Payment Data:", paymentData);

//         const payment = {
//             "sandbox": paymentData.sandbox === "1", // backend sends "1" for sandbox
//             "merchant_id": paymentData.merchant_id,
//             "return_url": paymentData.return_url || `${window.location.origin}/payments/success`,
//             "cancel_url": paymentData.cancel_url || `${window.location.origin}/payments/cancel`,
//             "notify_url": paymentData.notify_url || "http://localhost:8080/api/v1/payments/notify",
//             "order_id": paymentData.order_id,
//             "items": paymentData.items,
//             "amount": Number(parseFloat(paymentData.amount)),
//             "currency": paymentData.currency || "LKR",

//             // ✅ Use customer details from backend
//             "first_name": paymentData.first_name,
//             "last_name": paymentData.last_name,
//             "email": paymentData.email,
//             "phone": paymentData.phone,
//             "address": paymentData.address,
//             "city": paymentData.city,
//             "country": paymentData.country
//         };

//         // PayHere event handlers
//         payhere.onCompleted = function(orderId) {
//             console.log("Payment completed:", orderId);
//             Swal.fire("Payment Successful", `Order ID: ${orderId}`, "success");
//         };

//         payhere.onDismissed = function() {
//             console.log("Payment dismissed by user");
//             Swal.fire("Payment Cancelled", "You closed the payment window.", "warning");
//         };

//         payhere.onError = function(error) {
//             console.error("Payment error:", error);
//             Swal.fire("Payment Error", `Error: ${error}`, "error");
//         };

//         // Start the PayHere popup
//         payhere.startPayment(payment);

//     } catch (err) {
//         console.error("Error initiating payment:", err);
//         Swal.fire("Error!", "Unable to initiate payment.", "error");
//     }
// }

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
        // ===== Step 1: Test Hash from backend =====
        const hashRes = await fetch(`http://localhost:8080/api/v1/payments/test-hash/${appointmentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!hashRes.ok) {
            const errData = await hashRes.json();
            throw new Error(errData.error || "Hash test failed");
        }

        const hashData = await hashRes.json();
        console.log("Hash data:", hashData);

        // ===== Step 2: Fetch full PayHere form data =====
        const formRes = await fetch(`http://localhost:8080/api/v1/payments/create-payhere/${appointmentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!formRes.ok) {
            const errData = await formRes.json();
            throw new Error(errData.error || "Failed to create PayHere form data");
        }

        const paymentData = await formRes.json();
        console.log("PayHere form data:", paymentData);

        // ===== Step 3: Validate fields =====
        const requiredFields = ['merchant_id', 'order_id', 'amount', 'currency', 'hash', 'first_name', 'last_name'];
        for (const field of requiredFields) {
            if (!paymentData[field]) throw new Error(`Missing required field: ${field}`);
        }

        // ===== Step 4: Prepare PayHere object =====
        const payment = {
            sandbox: paymentData.sandbox === "1",
            merchant_id: paymentData.merchant_id,
            return_url: paymentData.return_url || `${window.location.origin}/payment-success.html`,
            cancel_url: paymentData.cancel_url || `${window.location.origin}/payment-cancel.html`,
            notify_url: paymentData.notify_url || "http://localhost:8080/api/v1/payments/notify",
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
            country: paymentData.country || "Sri Lanka",
            custom_1: paymentData.custom_1 || "",
            custom_2: paymentData.custom_2 || ""
        };

        console.log("Starting PayHere payment:", payment);

        // ===== Step 5: PayHere Callbacks =====
        payhere.onCompleted = function(orderId) {
            console.log("Payment completed:", orderId);
            Swal.fire("Payment Successful", `Order ID: ${orderId}`, "success");
        };

        payhere.onDismissed = function() {
            console.log("Payment dismissed by user");
            Swal.fire({
                title: "Payment Cancelled",
                text: "You closed the payment window. You can try again later.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Try Again",
                cancelButtonText: "Close"
            }).then(result => {
                if (result.isConfirmed) payNow(appointmentId);
            });
        };

        payhere.onError = function(error) {
            console.error("Payment error:", error);
            Swal.fire({
                title: "Payment Error",
                text: typeof error === "string" ? error : "Unknown error occurred",
                icon: "error",
                showCancelButton: true,
                confirmButtonText: "Try Again",
                cancelButtonText: "Close"
            }).then(result => {
                if (result.isConfirmed) payNow(appointmentId);
            });
        };

        // ===== Step 6: Start payment =====
        payhere.startPayment(payment);

    } catch (err) {
        console.error("Error initiating payment:", err);
        Swal.fire("Error!", err.message || "Unable to initiate payment.", "error");
    }
}


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
