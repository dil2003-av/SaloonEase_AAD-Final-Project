document.addEventListener("DOMContentLoaded", () => {
    fetchAppointments();
    fetchPayments();
    fetchServices();
});

// ======================= Appointments =======================
async function fetchAppointments() {
    const token = localStorage.getItem("token");
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    try {
        const response = await fetch("http://localhost:8080/api/v1/reports/appointments", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const appointments = await response.json();

        // Populate table
        appointments.forEach(app => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${app.id}</td>
                <td>${app.userEmail}</td>
                <td>${app.serviceName}</td>
                <td>${app.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="showBill(${app.id})">
                        View Bill
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        renderAppointmentsChart(appointments);
    } catch (err) {
        console.error("Error fetching appointments:", err);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load appointments</td></tr>`;
    }
}

async function showBill(appointmentId) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/v1/reports/bill/${appointmentId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const bill = await response.json();

        const modalBody = document.getElementById("billDetailsBody");
        modalBody.innerHTML = `
            <tr><th>Appointment ID</th><td>${bill.appointmentId}</td></tr>
            <tr><th>Customer Email</th><td>${bill.customerEmail}</td></tr>
            <tr><th>Service</th><td>${bill.serviceName}</td></tr>
            <tr><th>Status</th><td>${bill.appointmentStatus}</td></tr>
            <tr><th>Price</th><td>${bill.servicePrice}</td></tr>
            <tr><th>Payment Status</th><td>${bill.paymentStatus}</td></tr>
            <tr><th>Payment Method</th><td>${bill.paymentMethod || '-'}</td></tr>
            <tr><th>Transaction ID</th><td>${bill.transactionId || '-'}</td></tr>
            <tr><th>Payment Date</th><td>${bill.paymentDate || '-'}</td></tr>
        `;

        const billModal = new bootstrap.Modal(document.getElementById("billModal"));
        billModal.show();
    } catch (err) {
        console.error("Error fetching bill:", err);
        alert("Failed to fetch bill details. Please try again.");
    }
}

function printBill() {
    const billContent = document.getElementById("billDetailsBody").outerHTML;
    const newWin = window.open("");
    newWin.document.write(`<html><head><title>Bill</title></head><body><table>${billContent}</table></body></html>`);
    newWin.print();
    newWin.close();
}

// ======================= Payments =======================
async function fetchPayments() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:8080/api/v1/reports/payments", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const payments = await response.json();

        renderPaymentsChart(payments);
    } catch (err) {
        console.error("Error fetching payments:", err);
    }
}

// ======================= Services =======================
async function fetchServices() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:8080/api/v1/reports/services", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const services = await response.json();

        renderServicesChart(services);
    } catch (err) {
        console.error("Error fetching services:", err);
    }
}

// ======================= Charts =======================
function renderAppointmentsChart(appointments) {
    const statusCounts = appointments.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {});

    new Chart(document.getElementById("appointmentsChart"), {
        type: "doughnut",
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: "Appointments by Status",
                data: Object.values(statusCounts),
                backgroundColor: ["#0d6efd", "#ffc107", "#dc3545", "#198754"]
            }]
        }
    });
}

function renderPaymentsChart(payments) {
    const statusCounts = payments.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {});

    new Chart(document.getElementById("paymentsChart"), {
        type: "pie",
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: "Payments Overview",
                data: Object.values(statusCounts),
                backgroundColor: ["#198754", "#0d6efd", "#dc3545", "#ffc107"]
            }]
        }
    });
}

let servicesChartInstance; // global variable

function renderServicesChart(services) {
    const sorted = services
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 5);

    // Destroy previous chart if exists
    if (servicesChartInstance) {
        servicesChartInstance.destroy();
    }

    servicesChartInstance = new Chart(document.getElementById("servicesChart"), {
        type: "bar",
        data: {
            labels: sorted.map(s => s.serviceName),
            datasets: [{
                label: "Popular Services",
                data: sorted.map(s => s.usageCount || 0),
                backgroundColor: "#0d6efd"
            }]
        },
        options: {
            indexAxis: 'y'
        }
    });
}


async function loadPopularServices() {
    try {
        const response = await fetch("http://localhost:8080/api/v1/reports/popular-services");
        const data = await response.json();
        renderServicesChart(data);  // function defined now
    } catch (error) {
        console.error("Error loading popular services:", error);
    }
}

loadPopularServices();

