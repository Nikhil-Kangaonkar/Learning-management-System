// ✅ Sidebar Toggle  
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

// ✅ Logout & Auto Logout Handling
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector(".logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (e) {
            e.preventDefault();

            if (confirm("Are you sure you want to log out?")) {
                // ✅ Clear user session
                localStorage.clear();
                sessionStorage.clear();

                // ✅ Redirect to login page
                window.location.href = "../frontend/signin_signup.html";

                // ✅ Prevent Back Button Access After Logout
                window.history.pushState(null, null, window.location.href);
            }
        });
    } else {
        console.error("Logout button not found!");
    }

    // ✅ Redirect if user is not logged in
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please log in first.");
        window.location.href = "../frontend/signin_signup.html";
        return;
    }

    // ✅ Ensure only ADMIN can access this page
    if (user.role !== "ADMIN") {
        alert("Unauthorized Access!");
        window.location.href = "../frontend/signin_signup.html";
    }

    // ✅ Prevent Back Button Navigation to Dashboard After Logout
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", function () {
        window.location.href = "../frontend/signin_signup.html";
    });

    // ✅ Load Users and Courses on Page Load
    loadUsers();
    loadCourses();
});


// ✅ Load Users from Backend API
async function loadUsers() {
    try {
        const response = await fetch("http://localhost:8080/api/users/all");
        const users = await response.json();

        const usersTable = document.querySelector("#usersTable tbody");
        usersTable.innerHTML = ""; // Clear previous data

        users.forEach(user => {
            usersTable.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="openEditUserModal(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        alert("Failed to load users. Try again later.");
    }
}

// ✅ Open Edit User Modal
function openEditUserModal(userId, name, email, role) {
    document.getElementById("userModalTitle").innerText = "Edit User";
    document.getElementById("userName").value = name;
    document.getElementById("userEmail").value = email;
    document.getElementById("userRole").value = role;
    editingUserId = userId; // Store user ID for updating
    document.getElementById("userModal").style.display = "block";
}

// ✅ Close User Modal
function closeUserModal() {
    document.getElementById("userModal").style.display = "none";
}

// ✅ Save (Update) User Role Only  
async function saveUser() {  
    const name = document.getElementById("userName").value;  
    const email = document.getElementById("userEmail").value;  
    const role = document.getElementById("userRole").value;  

    if (!name || !email || !role) {  
        alert("❌ Please fill all fields!");  
        return;  
    }  

    if (!editingUserId) {  
        alert("❌ Cannot add new users! Only role updates are allowed.");  
        return;  
    }  

    const userData = { name, email, role };  

    try {  
        const response = await fetch(`http://localhost:8080/api/users/update/${editingUserId}`, {  
            method: "PUT",  
            headers: { "Content-Type": "application/json" },  
            body: JSON.stringify(userData),  
        });  

        if (response.ok) {  
            alert("✅ User updated successfully ! Please log in again.");  
             // ✅ Force Logout After Role Change  
             localStorage.clear();  
             sessionStorage.clear();  
             window.location.href = "../frontend/signin_signup.html"; 
            closeUserModal();  
            loadUsers(); // Reload users after updating  
        } else {  
            alert("❌ Failed to update user. Try again.");  
        }  
    } catch (error) {  
        console.error("❌ Error updating user:", error);  
        alert("An error occurred. Try again later.");  
    }  
}

// ✅ Delete User from Backend API
async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        const response = await fetch(`http://localhost:8080/api/users/delete/${userId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("✅ User deleted successfully!");
            loadUsers(); // Reload users after deletion
        } else {
            alert("❌ Failed to delete user. It may not exist.");
        }
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        alert("An error occurred. Try again later.");
    }
}

// ✅ Load Courses from Backend API
async function loadCourses() {
    try {
        const response = await fetch("http://localhost:8080/api/courses/all");
        const courses = await response.json();

        const coursesTable = document.querySelector("#coursesTable tbody");
        coursesTable.innerHTML = ""; // Clear previous data

        courses.forEach(course => {
            const publishText = course.published ? "Unpublish" : "Publish";
            coursesTable.innerHTML += `
                <tr>
                    <td>${course.title}</td>
                    <td>${course.description}</td>
                    <td>${course.price}</td>
                    <td>
                        <button onclick="togglePublish(${course.id})">${publishText}</button>
                        <button onclick="openEditCourseModal(${course.id}, '${course.title}', '${course.description}', '${course.longDescription}', '${course.batch}', '${course.timing}', '${course.duration}', '${course.mode}', '${course.instructorName}', '${course.instructorBio}', ${course.price}, '${course.thumbnailUrl}',  '${course.videoUrl}')">Edit</button>
                        <button onclick="deleteCourse(${course.id})">Delete</button>
                        <button onclick="viewEnrolledStudents(${course.id})">View Enrolled</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        alert("Failed to load courses. Try again later.");
    }
}

// ✅ Open Course Modal (for Adding or Editing)
let editingCourseId = null; // Track course being edited

function openCourseModal() {
    document.getElementById("courseModalTitle").innerText = "Add Course";
    document.getElementById("courseForm").reset(); // Clear the form
    editingCourseId = null; // Reset edit mode
    document.getElementById("courseModal").style.display = "block";
}

// ✅ Open Edit Course Modal
function openEditCourseModal(courseId, title, description, longDescription, batch, timing, duration, mode, instructorName, instructorBio, price, thumbnailUrl, videoUrl) {
    document.getElementById("courseModalTitle").innerText = "Edit Course";
    document.getElementById("courseName").value = title;
    document.getElementById("courseDescription").value = description;
    document.getElementById("courseLongDescription").value = longDescription;
    document.getElementById("courseBatch").value = batch;
    document.getElementById("courseTiming").value = timing;
    document.getElementById("courseDuration").value = duration;
    document.getElementById("courseMode").value = mode;
    document.getElementById("courseInstructorName").value = instructorName;
    document.getElementById("courseInstructorBio").value = instructorBio;
    document.getElementById("coursePrice").value = price;
    document.getElementById("courseThumbnail").value = thumbnailUrl || "default-thumbnail.jpg";
    document.getElementById("courseVideoUrl").value = videoUrl || "";

    editingCourseId = courseId; // Store course ID for updating
    document.getElementById("courseModal").style.display = "block";
}

// ✅ Close Course Modal
function closeCourseModal() {
    document.getElementById("courseModal").style.display = "none";
}

// ✅ Save or Update Course
async function saveCourse() {
    const title = document.getElementById("courseName").value;
    const description = document.getElementById("courseDescription").value;
    const longDescription = document.getElementById("courseLongDescription").value;
    const batch = document.getElementById("courseBatch").value;
    const timing = document.getElementById("courseTiming").value;
    const duration = document.getElementById("courseDuration").value;
    const mode = document.getElementById("courseMode").value;
    const instructorName = document.getElementById("courseInstructorName").value;
    const instructorBio = document.getElementById("courseInstructorBio").value;
    const price = parseFloat(document.getElementById("coursePrice").value);
    const thumbnailUrl = document.getElementById("courseThumbnail").value || "default-thumbnail.jpg";
    const videoUrl = document.getElementById("courseVideoUrl").value || "";


    if (!title || !description || !price || !batch || !timing || !duration || !mode || !instructorName || !instructorBio || !thumbnailUrl) {
        alert("❌ Please fill all fields!");
        return;
    }

    const courseData = { title, description, longDescription, batch, timing, duration, mode, instructorName, instructorBio, price, thumbnailUrl, videoUrl , published: true };

    try {
        let response;

        if (editingCourseId) {
            // ✅ Update Course
            response = await fetch(`http://localhost:8080/api/courses/update/${editingCourseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(courseData),
            });
        } else {
            // ✅ Add New Course
            response = await fetch("http://localhost:8080/api/courses/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(courseData),
            });
        }

        if (response.ok) {
            alert("✅ Course saved successfully!");
            closeCourseModal();
            loadCourses(); // Reload courses after saving
        } else {
            alert("❌ Failed to save course. Try again.");
        }
    } catch (error) {
        console.error("❌ Error saving course:", error);
        alert("An error occurred. Try again later.");
    }
}

// ✅ Delete Course from Backend API
async function deleteCourse(courseId) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
        const response = await fetch(`http://localhost:8080/api/courses/delete/${courseId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("✅ Course deleted successfully!");
            loadCourses(); // Reload courses after deletion
        } else {
            alert("❌ Failed to delete course. It may not exist.");
        }
    } catch (error) {
        console.error("❌ Error deleting course:", error);
        alert("An error occurred. Try again later.");
    }
}

// ✅ Close Modal on Click Outside
window.onclick = function (event) {
    const modal = document.getElementById("courseModal");
    if (event.target === modal) {
        closeCourseModal();
    }
};

async function togglePublish(courseId) {
    try {
        const response = await fetch(`http://localhost:8080/api/courses/publish/${courseId}`, {
            method: "PUT",
        });

        if (response.ok) {
            alert("✅ Course publish status updated!");
            loadCourses(); // Reload courses after updating
        } else {
            alert("❌ Failed to update publish status. Try again.");
        }
    } catch (error) {
        console.error("❌ Error updating publish status:", error);
        alert("An error occurred. Try again later.");
    }
}


// ✅ Fetch Enrolled Students for a Course
// async function loadEnrolledStudents(courseId) {
//     try {
//         const response = await fetch(`http://localhost:8080/api/enrollments/course/${courseId}`);
//         const students = await response.json();

//         const enrolledStudentsList = document.getElementById("enrolledStudentsList");
//         enrolledStudentsList.innerHTML = ""; // Clear previous data

//         if (students.length === 0) {
//             enrolledStudentsList.innerHTML = "<p>No students enrolled in this course.</p>";
//         } else {
//             students.forEach(student => {
//                 enrolledStudentsList.innerHTML += `<li>${student.name} (${student.email})</li>`;
//             });
//         }

//         document.getElementById("enrolledStudentsModal").style.display = "block"; // Open modal
//     } catch (error) {
//         console.error("❌ Error fetching enrolled students:", error);
//         alert("Failed to load enrolled students.");
//     }
// }

// ✅ Fetch and Show Enrolled Students in Modal
async function viewEnrolledStudents(courseId) {
    try {
        const response = await fetch(`http://localhost:8080/api/enrollments/course/${courseId}`);
        const students = await response.json();

        const tableBody = document.querySelector("#enrolledStudentsTable tbody");
        tableBody.innerHTML = ""; // Clear previous data

        if (students.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='3'>No students enrolled</td></tr>";
        } else {
            students.forEach(student => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                    </tr>
                `;
            });
        }

        // Open Modal
        document.getElementById("enrolledStudentsModal").style.display = "block";

    } catch (error) {
        console.error("❌ Error fetching enrolled students:", error);
        alert("Failed to load enrolled students.");
    }
}

// ✅ Close the Modal
function closeEnrolledStudentsModal() {
    document.getElementById("enrolledStudentsModal").style.display = "none";
}

// ✅ Close Modal on Click Crossair
function closeEnrolledStudentsModal() {
    document.getElementById("enrolledStudentsModal").style.display = "none";
}

// ✅ Download Users Report (CSV)
document.getElementById("download-users").addEventListener("click", function () {
    let csvContent = "User,Email,Role\n";
    
    fetch("http://localhost:8080/api/users/all")
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                csvContent += `${user.name},${user.email},${user.role}\n`;
            });

            const blob = new Blob([csvContent], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Users_Report.csv";
            link.click();
        })
        .catch(error => console.error("❌ Error downloading User report:", error));
});

// ✅ Download Users Report (CSV)
document.getElementById("download-courses").addEventListener("click", function () {
    let csvContent = "Course,Description,Price\n";
    
    fetch("http://localhost:8080/api/courses/all")
        .then(response => response.json())
        .then(users => {
            users.forEach(course => {
                csvContent += `${course.title},${course.description},${course.price}\n`;
            });

            const blob = new Blob([csvContent], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Courses_Report.csv";
            link.click();
        })
        .catch(error => console.error("❌ Error downloading Course report:", error));
});