// const API_BASE_URL = "http://localhost:8080/api/v1/reviews";

// const reviewsTableBody = document.getElementById("reviewsTableBody");
// const reviewsContainer = document.getElementById("reviewsContainer");
// let reviews = [];

// // Load reviews on page load
// window.onload = fetchReviews;

// // Fetch all reviews
// async function fetchReviews() {
//     try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/getall`, {
//             headers: { "Authorization": `Bearer ${token}` }
//         });
//         const result = await res.json();
//         reviews = result.data;

//         reviewsTableBody.innerHTML = "";
//         reviews.forEach((review, index) => {
//             reviewsTableBody.innerHTML += `
//                 <tr>
//                     <td>${index + 1}</td>
//                     <td>${review.userEmail.split("@")[0]}</td>
//                     <td>${review.userEmail}</td>
//                     <td>${review.serviceName}</td>
//                     <td>${review.reviewText}</td>
//                     <td>${review.status}</td>
//                     <td>
//                         <button class="btn btn-sm btn-info" onclick="viewReview(${index})">View</button>
//                         <button class="btn btn-sm btn-warning" onclick="editReview(${index})">Edit</button>
//                         <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.id})">Delete</button>
//                     </td>
//                 </tr>`;
//         });
//     } catch (err) {
//         console.error("Error fetching reviews:", err);
//     }
// }

// // View Review
// window.viewReview = (i) => {
//     const r = reviews[i];
//     Swal.fire({
//         title: "Review Details",
//         html: `
//             <b>User:</b> ${r.userEmail}<br>
//             <b>Service:</b> ${r.serviceName}<br>
//             <b>Comment:</b> ${r.reviewText}<br>
//             <b>Status:</b> ${r.status}
//         `,
//         icon: "info",
//         confirmButtonColor: "#667eea"
//     });
// };

// // Edit Review
// window.editReview = (i) => {
//     const r = reviews[i];
//     Swal.fire({
//         title: "Edit Review",
//         html: `<textarea id="editComment" class="swal2-textarea" placeholder="Comment">${r.reviewText}</textarea>`,
//         confirmButtonText: "Save",
//         showCancelButton: true,
//         preConfirm: () => {
//             return {
//                 id: r.id,
//                 reviewText: document.getElementById("editComment").value,
//                 userEmail: r.userEmail,
//                 serviceName: r.serviceName,
//                 status: r.status
//             };
//         }
//     }).then(async result => {
//         if (result.isConfirmed) {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await fetch(`${API_BASE_URL}/update`, {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${token}`
//                     },
//                     body: JSON.stringify(result.value)
//                 });
//                 const response = await res.json();
//                 Swal.fire("Updated!", response.message || "Review updated successfully", "success");
//                 fetchReviews();
//             } catch (err) {
//                 console.error("Error updating review:", err);
//                 Swal.fire("Error!", "Failed to update review", "error");
//             }
//         }
//     });
// };

// // Delete Review
// window.deleteReview = async (id) => {
//     Swal.fire({
//         title: "Are you sure?",
//         text: "This review will be permanently deleted!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!"
//     }).then(async (result) => {
//         if (result.isConfirmed) {
//             try {
//                 const token = localStorage.getItem("token");
//                 await fetch(`${API_BASE_URL}/delete/${id}`, {
//                     method: "DELETE",
//                     headers: { "Authorization": `Bearer ${token}` }
//                 });
//                 fetchReviews();
//                 Swal.fire("Deleted!", "Review deleted successfully", "success");
//             } catch (err) {
//                 console.error("Error deleting review:", err);
//                 Swal.fire("Error!", "Failed to delete review", "error");
//             }
//         }
//     });
// };

// // Submit new review (without rating)
// document.getElementById('reviewForm').addEventListener('submit', async function (e) {
//     e.preventDefault();
//     const name = document.getElementById('customerName').value;
//     const email = document.getElementById('customerEmail').value;
//     const service = document.getElementById('serviceReviewed').value;
//     const reviewText = document.getElementById('reviewText').value;

//     const review = { userEmail: email, serviceName: service, reviewText, status: 'Pending' };
//     const token = localStorage.getItem("token");

//     try {
//         await fetch(`${API_BASE_URL}/create`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify(review)
//         });

//         addReviewToTableAndDisplay(name, email, service, reviewText);

//         this.reset();

//         Swal.fire({ icon: 'success', title: 'Thank You!', text: 'Your review has been submitted successfully and is pending approval!', timer: 3000, showConfirmButton: false });
//     } catch (err) {
//         console.error("Error submitting review:", err);
//         Swal.fire("Error!", "Failed to submit review", "error");
//     }
// });

// function addReviewToTableAndDisplay(name, email, service, reviewText) {
//     // Table
//     const newRow = document.createElement('tr');
//     const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
//     const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     const previewText = reviewText.length > 50 ? reviewText.substring(0, 47) + '...' : reviewText;

//     newRow.innerHTML = `
//         <td>
//             <div class="d-flex align-items-center">
//                 <div class="reviewer-avatar me-2" style="width: 30px; height: 30px; font-size: 0.8em;">${initials}</div>
//                 <div>
//                     <div class="fw-bold">${name}</div>
//                     <small class="text-muted">${email}</small>
//                 </div>
//             </div>
//         </td>
//         <td><span class="badge bg-primary">${service}</span></td>
//         <td>${currentDate}</td>
//         <td class="review-preview">${previewText}</td>
//         <td><span class="badge bg-warning">Pending</span></td>
//         <td>
//             <button class="btn btn-sm btn-outline-primary view-btn me-1" title="View Full Review"><i class="fas fa-eye"></i></button>
//             <button class="btn btn-sm btn-outline-warning edit-review-btn me-1" title="Edit Review"><i class="fas fa-edit"></i></button>
//             <button class="btn btn-sm btn-outline-danger delete-review-btn" title="Delete Review"><i class="fas fa-trash"></i></button>
//         </td>
//     `;
//     reviewsTableBody.insertBefore(newRow, reviewsTableBody.firstChild);

//     // Display section
//     const newReview = document.createElement('div');
//     newReview.className = 'review-card';
//     newReview.innerHTML = `
//         <div class="review-header">
//             <div class="reviewer-avatar">${initials}</div>
//             <div class="reviewer-info">
//                 <h5>${name}</h5>
//                 <div class="review-date">${currentDate}</div>
//             </div>
//         </div>
//         <div class="service-tag">${service}</div>
//         <div class="review-text">${reviewText}</div>
//     `;
//     reviewsContainer.insertBefore(newReview, reviewsContainer.firstChild);

//     // Update total reviews
//     const totalReviews = document.getElementById('totalReviews');
//     const currentTotal = parseInt(totalReviews.textContent);
//     totalReviews.textContent = currentTotal + 1;
// }

// // Filter by service or other attributes if needed
// document.querySelectorAll('.filter-btn').forEach(btn => {
//     btn.addEventListener('click', function () {
//         document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
//         this.classList.add('active');

//         const filter = this.getAttribute('data-filter');
//         document.querySelectorAll('.review-card').forEach(card => {
//             card.style.display = (filter === 'all' || card.querySelector('.service-tag').textContent === filter) ? 'block' : 'none';
//         });
//     });
// });

// // Load More Reviews demo
// document.getElementById('loadMoreBtn').addEventListener('click', function () {
//     Swal.fire({ icon: 'info', title: 'Loading...', text: 'Loading more reviews from database...', confirmButtonColor: '#667eea', timer: 2000, showConfirmButton: false });
// });

const API_BASE_URL = "http://localhost:8080/api/v1/reviews";

const reviewsTableBody = document.getElementById("reviewsTableBody");
const reviewsContainer = document.getElementById("reviewsContainer");
let reviews = [];

// Load reviews on page load
window.onload = fetchReviews;

// Fetch all reviews
async function fetchReviews() {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/getall`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        reviews = result.data;

        reviewsTableBody.innerHTML = "";
        reviewsContainer.innerHTML = "";

        reviews.forEach((review, index) => {
            const initials = review.userEmail.split("@")[0].slice(0, 2).toUpperCase();
            const currentDate = new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            // Table
            reviewsTableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${review.userEmail}</td>
                    <td>${review.serviceName}</td>
                    <td>${review.rating} ⭐</td>
                    <td>${review.reviewText}</td>
                    <td>${review.status}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="viewReview(${index})">View</button>
                        <button class="btn btn-sm btn-warning" onclick="editReview(${index})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.id})">Delete</button>
                    </td>
                </tr>`;

            // Display Cards
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.setAttribute('data-rating', review.rating);
            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-avatar">${initials}</div>
                    <div class="reviewer-info">
                        <h5>${review.userEmail.split("@")[0]}</h5>
                        <div class="review-date">${currentDate}</div>
                    </div>
                </div>
                <div class="star-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <div class="service-tag">${review.serviceName}</div>
                <div class="review-text">${review.reviewText}</div>
            `;
            reviewsContainer.appendChild(reviewCard);
        });

        // Update total reviews
        const totalReviews = document.getElementById('totalReviews');
        totalReviews.textContent = reviews.length;

    } catch (err) {
        console.error("Error fetching reviews:", err);
    }
}

// View Review
window.viewReview = (i) => {
    const r = reviews[i];
    Swal.fire({
        title: "Review Details",
        html: `
            <b>User:</b> ${r.userEmail}<br>
            <b>Service:</b> ${r.serviceName}<br>
            <b>Rating:</b> ${r.rating} ⭐<br>
            <b>Comment:</b> ${r.reviewText}<br>
            <b>Status:</b> ${r.status}
        `,
        icon: "info",
        confirmButtonColor: "#667eea"
    });
};

// Edit Review
window.editReview = (i) => {
    const r = reviews[i];
    Swal.fire({
        title: "Edit Review",
        html: `
            <textarea id="editComment" class="swal2-textarea">${r.reviewText}</textarea>
            <select id="editRating" class="swal2-select">
                <option value="1" ${r.rating === 1 ? 'selected' : ''}>1</option>
                <option value="2" ${r.rating === 2 ? 'selected' : ''}>2</option>
                <option value="3" ${r.rating === 3 ? 'selected' : ''}>3</option>
                <option value="4" ${r.rating === 4 ? 'selected' : ''}>4</option>
                <option value="5" ${r.rating === 5 ? 'selected' : ''}>5</option>
            </select>
        `,
        confirmButtonText: "Save",
        showCancelButton: true,
        preConfirm: () => ({
            id: r.id,
            reviewText: document.getElementById("editComment").value,
            userEmail: r.userEmail,
            serviceName: r.serviceName,
            rating: parseInt(document.getElementById("editRating").value),
            status: r.status
        })
    }).then(async result => {
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(result.value)
                });
                const response = await res.json();
                Swal.fire("Updated!", response.message || "Review updated successfully", "success");
                fetchReviews();
            } catch (err) {
                console.error("Error updating review:", err);
                Swal.fire("Error!", "Failed to update review", "error");
            }
        }
    });
};

// Delete Review
window.deleteReview = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "This review will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                await fetch(`${API_BASE_URL}/delete/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchReviews();
                Swal.fire("Deleted!", "Review deleted successfully", "success");
            } catch (err) {
                console.error("Error deleting review:", err);
                Swal.fire("Error!", "Failed to delete review", "error");
            }
        }
    });
};

// Submit new review
document.getElementById('reviewForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const service = document.getElementById('serviceReviewed').value;
    const reviewText = document.getElementById('reviewText').value;
    const rating = parseInt(document.getElementById('ratingSelect').value);

    const review = { userEmail: email, serviceName: service, reviewText, rating, status: 'Pending' };
    const token = localStorage.getItem("token");

    try {
        await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(review)
        });
        Swal.fire({ icon: 'success', title: 'Thank You!', text: 'Your review has been submitted successfully and is pending approval!', timer: 3000, showConfirmButton: false });
        this.reset();
        fetchReviews();
    } catch (err) {
        console.error("Error submitting review:", err);
        Swal.fire("Error!", "Failed to submit review", "error");
    }
});

// Filter by rating
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        document.querySelectorAll('.review-card').forEach(card => {
            const rating = card.getAttribute('data-rating');
            card.style.display = (filter === 'all' || rating === filter) ? 'block' : 'none';
        });
    });
});

// Load More demo
document.getElementById('loadMoreBtn').addEventListener('click', function () {
    Swal.fire({ icon: 'info', title: 'Loading...', text: 'Loading more reviews from database...', confirmButtonColor: '#667eea', timer: 2000, showConfirmButton: false });
});
