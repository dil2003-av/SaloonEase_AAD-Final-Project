// const API_BASE_URL = "http://localhost:8080/api/services";

// const serviceModal = new bootstrap.Modal(document.getElementById("serviceModal"));
// const addServiceBtn = document.getElementById("addServiceBtn");
// const serviceForm = document.getElementById("serviceForm");
// const servicesTableBody = document.getElementById("servicesTableBody");
// const editingIndexInput = document.getElementById("editingIndex");

// let services = [];

// // Load services on page load
// window.onload = fetchServices;

// // Fetch and render services
// async function fetchServices() {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API_BASE_URL}/getall`, {
//       headers: { "Authorization": `Bearer ${token}` }
//     });
//     const result = await res.json();
//     services = result.data;

//     servicesTableBody.innerHTML = "";
//     services.forEach((service, index) => {
//       servicesTableBody.innerHTML += `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${service.name}</td>
//           <td>${service.description}</td>
//           <td>${service.price}</td>
//           <td>${service.duration}</td>
//           <td>${service.createdAt}</td>
//           <td>
//             <img src="${service.imageUrl.startsWith('http') ? service.imageUrl : 'http://localhost:8080' + service.imageUrl}" width="80">
//           </td>
//           <td>
//             <button class="btn btn-sm btn-primary" onclick="editService(${index})">Edit</button>
//             <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">Delete</button>
//           </td>
//         </tr>`;
//     });
//   } catch (err) {
//     console.error("Error fetching services:", err);
//   }
// }

// // Add button click
// addServiceBtn.onclick = () => {
//   serviceForm.reset();
//   editingIndexInput.value = "";
//   serviceModal.show();
// };

// // Submit form for create or update
// serviceForm.onsubmit = async (e) => {
//   e.preventDefault();
//   const i = editingIndexInput.value;
//   const isEdit = i !== "";
//   const fileInput = document.getElementById("serviceImage");

//   // Show loading modal
//   Swal.fire({
//     title: isEdit ? 'Updating service...' : 'Creating service...',
//     html: 'Please wait while the request is being processed.',
//     allowOutsideClick: false,
//     didOpen: () => {
//       Swal.showLoading();
//     }
//   });
// if (isEdit) {
//   const file = fileInput.files[0];

//   const formData = new FormData();
//   formData.append("id", services[i].id);
//   formData.append("name", document.getElementById("serviceName").value);
//   formData.append("description", document.getElementById("serviceDesc").value);
//   formData.append("price", parseFloat(document.getElementById("servicePrice").value));
//   formData.append("duration", document.getElementById("serviceDuration").value);
//   formData.append("createdAt", document.getElementById("serviceDate").value);
//   if (file) {
//     formData.append("file", file);
//   }

//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API_BASE_URL}/update/${services[i].id}`, {
//       method: "POST",
//       headers: { "Authorization": `Bearer ${token}` },
//       body: formData
//     });
//     const result = await res.json();
//     Swal.close();
//     Swal.fire("Updated!", result.message || "Service updated successfully", "success");
//     serviceModal.hide();
//     fetchServices();
//   } catch (err) {
//     Swal.close();
//     console.error("Error updating service:", err);
//     Swal.fire("Error!", "Failed to update service", "error");
//   }



//   } else {
//     // --- CREATE NEW SERVICE WITH FILE ---
//     const file = fileInput.files[0];
//     if (!file) {
//       Swal.close();
//       Swal.fire("Warning!", "Please select an image for new service.", "warning");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("name", document.getElementById("serviceName").value);
//     formData.append("description", document.getElementById("serviceDesc").value);
//     formData.append("price", parseFloat(document.getElementById("servicePrice").value));
//     formData.append("duration", document.getElementById("serviceDuration").value);
//     formData.append("createdAt", document.getElementById("serviceDate").value);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/create`, {
//         method: "POST",
//         headers: { "Authorization": `Bearer ${token}` },
//         body: formData
//       });
//       const result = await res.json();
//       Swal.close(); // close loading
//       Swal.fire("Created!", result.message || "Service created successfully", "success");
//       serviceModal.hide();
//       fetchServices();
//     } catch (err) {
//       Swal.close();
//       console.error("Error creating service:", err);
//       Swal.fire("Error!", "Failed to create service", "error");
//     }
//   }
// };

// // Edit service
// window.editService = (i) => {
//   const s = services[i];
//   document.getElementById("serviceName").value = s.name;
//   document.getElementById("serviceDesc").value = s.description;
//   document.getElementById("servicePrice").value = s.price;
//   document.getElementById("serviceDuration").value = s.duration;
//   document.getElementById("serviceDate").value = s.createdAt;
//   editingIndexInput.value = i;
//   serviceModal.show();
// };

// // Delete service
// window.deleteService = async (id) => {
//   Swal.fire({
//     title: "Are you sure?",
//     text: "You won’t be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, delete it!",
//     cancelButtonText: "No, cancel!"
//   }).then(async (result) => {
//     if (result.isConfirmed) {
//       try {
//         const token = localStorage.getItem("token");
//         await fetch(`${API_BASE_URL}/${id}`, {
//           method: "DELETE",
//           headers: { "Authorization": `Bearer ${token}` }
//         });
//         fetchServices();
//         Swal.fire("Deleted!", "Service deleted successfully", "success");
//       } catch (err) {
//         console.error("Error deleting service:", err);
//         Swal.fire("Error!", "Failed to delete service", "error");
//       }
//     }
//   });
// };

const API_BASE_URL = "http://localhost:8080/api/services";

const serviceModal = new bootstrap.Modal(document.getElementById("serviceModal"));
const addServiceBtn = document.getElementById("addServiceBtn");
const serviceForm = document.getElementById("serviceForm");
const servicesTableBody = document.getElementById("servicesTableBody");
const editingIndexInput = document.getElementById("editingIndex");

let services = [];

// Load services
window.onload = fetchServices;

async function fetchServices() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/getall`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    services = result.data || [];

    servicesTableBody.innerHTML = "";
    services.forEach((s, i) => {
      const imgSrc = s.imageUrl.startsWith("http")
        ? s.imageUrl
        : `${API_BASE_URL}/uploads/${s.imageUrl.split("/").pop()}`;

      servicesTableBody.innerHTML += `
        <tr>
          <td>${i+1}</td>
          <td>${s.name}</td>
          <td>${s.description}</td>
          <td>${s.price}</td>
          <td>${s.duration}</td>
          <td>${s.createdAt}</td>
          <td><img src="${imgSrc}" width="80"></td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editService(${i})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteService(${s.id})">Delete</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", "Failed to fetch services.", "error");
  }
}

// Add new
addServiceBtn.onclick = () => {
  serviceForm.reset();
  editingIndexInput.value = "";
  serviceModal.show();
};

// Submit form
serviceForm.onsubmit = async (e) => {
  e.preventDefault();
  const index = editingIndexInput.value;
  const isEdit = index !== "";
  const fileInput = document.getElementById("serviceImage");

  const formData = new FormData();
  formData.append("name", document.getElementById("serviceName").value);
  formData.append("description", document.getElementById("serviceDesc").value);
  formData.append("price", parseFloat(document.getElementById("servicePrice").value));
  formData.append("duration", document.getElementById("serviceDuration").value);
  formData.append("createdAt", document.getElementById("serviceDate").value);

  if (fileInput.files.length > 0) formData.append("file", fileInput.files[0]);

  try {
    const token = localStorage.getItem("token");
    const url = isEdit
      ? `${API_BASE_URL}/update/${services[index].id}`
      : `${API_BASE_URL}/create`;
    const method = isEdit ? "PUT" : "POST";

    Swal.fire({
      title: isEdit ? "Updating..." : "Creating...",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: formData });
    const result = await res.json();
    Swal.close();

    Swal.fire(isEdit ? "Updated!" : "Created!", result.message || "Success", "success");
    serviceModal.hide();
    fetchServices();
  } catch (err) {
    Swal.close();
    console.error(err);
    Swal.fire("Error!", "Failed to save service.", "error");
  }
};

// Edit
window.editService = (i) => {
  const s = services[i];
  document.getElementById("serviceName").value = s.name;
  document.getElementById("serviceDesc").value = s.description;
  document.getElementById("servicePrice").value = s.price;
  document.getElementById("serviceDuration").value = s.duration;
  document.getElementById("serviceDate").value = s.createdAt;
  editingIndexInput.value = i;
  serviceModal.show();
};

// Delete
window.deleteService = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won’t be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  }).then(async (res) => {
    if (!res.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      Swal.fire("Deleted!", "Service deleted successfully.", "success");
      fetchServices();
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to delete service.", "error");
    }
  });
};

