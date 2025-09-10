
const API_BASE_URL = "http://localhost:8080/api/v1/reviews";
const adminReviewsBody = document.getElementById("adminReviewsBody");
let reviews = [];

window.onload = fetchAdminReviews;

async function fetchAdminReviews() {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/getall`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        reviews = result.data;

        adminReviewsBody.innerHTML = "";
        reviews.forEach((review, i) => {
            adminReviewsBody.innerHTML += `
                <tr>
                    <td>${review.id}</td>
                    <td>${review.userEmail}</td>
                    <td>${review.serviceName}</td>
                    <td>${review.rating} ⭐</td>
                    <td>${review.reviewText}</td>
                    <td>${review.status}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="viewReview(${i})"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-warning" onclick="editReview(${i})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.id})"><i class="fas fa-trash"></i></button>
                        <button class="btn btn-sm btn-success" onclick="changeStatus(${review.id}, 'Approved')">Approve</button>
                        <button class="btn btn-sm btn-secondary" onclick="changeStatus(${review.id}, 'Declined')">Decline</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error fetching reviews:", err);
    }
}

function viewReview(i) {
    const r = reviews[i];
    Swal.fire({
        title: "Review Details",
        html: `<b>Email:</b> ${r.userEmail}<br>
               <b>Service:</b> ${r.serviceName}<br>
               <b>Rating:</b> ${r.rating} ⭐<br>
               <b>Review:</b> ${r.reviewText}<br>
               <b>Status:</b> ${r.status}`,
        icon: "info",
        confirmButtonColor: "#667eea"
    });
}

function editReview(i) {
    const r = reviews[i];
    Swal.fire({
        title: "Edit Review",
        html: `<textarea id="editComment" class="swal2-textarea">${r.reviewText}</textarea>
               <select id="editRating" class="swal2-select">
                   <option value="1" ${r.rating===1?'selected':''}>1</option>
                   <option value="2" ${r.rating===2?'selected':''}>2</option>
                   <option value="3" ${r.rating===3?'selected':''}>3</option>
                   <option value="4" ${r.rating===4?'selected':''}>4</option>
                   <option value="5" ${r.rating===5?'selected':''}>5</option>
               </select>`,
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
        if(result.isConfirmed){
            try{
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/update`, {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body: JSON.stringify(result.value)
                });
                const response = await res.json();
                Swal.fire("Updated!", response.message || "Review updated successfully", "success");
                fetchAdminReviews();
            }catch(err){
                console.error("Error updating review:", err);
                Swal.fire("Error!","Failed to update review","error");
            }
        }
    });
}

async function deleteReview(id){
    Swal.fire({
        title:"Are you sure?",
        text:"This review will be permanently deleted!",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Yes, delete it!"
    }).then(async result=>{
        if(result.isConfirmed){
            try{
                const token = localStorage.getItem("token");
                await fetch(`${API_BASE_URL}/delete/${id}`,{
                    method:"DELETE",
                    headers:{"Authorization":`Bearer ${token}`}
                });
                Swal.fire("Deleted!","Review deleted successfully","success");
                fetchAdminReviews();
            }catch(err){
                console.error("Error deleting review:", err);
                Swal.fire("Error!","Failed to delete review","error");
            }
        }
    });
}

async function changeStatus(id, status){
    try{
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/status/${id}?status=${status}`,{
            method:"PATCH",
            headers:{"Authorization":`Bearer ${token}`}
        });
        Swal.fire("Success!",`Status changed to ${status}`,"success");
        fetchAdminReviews();
    }catch(err){
        console.error("Error changing status:", err);
        Swal.fire("Error!","Failed to change status","error");
    }
}
