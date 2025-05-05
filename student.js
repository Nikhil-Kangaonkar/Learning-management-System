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
 
async function loadPublishedCourses() {
  try {
      const response = await fetch("http://localhost:8080/api/courses/published");
      const courses = await response.json();

      const courseSlider = document.getElementById("courseSlider");
      courseSlider.innerHTML = "";

      courses.forEach(course => {
          const courseCard = `
              <div class="course-card">
                  <img src="${course.thumbnailUrl}" alt="${course.title}" class="course-thumbnail">
                  <div class="course-info">
                      <h3>${course.title}</h3>
                      <p>${course.description}</p>
                      <span class="course-price">₹${course.price}</span>
                      <a href="coursedescription.html?id=${course.id}" class="course-details-btn">View Details</a>
                  </div>
              </div>
          `;
          courseSlider.innerHTML += courseCard;
      });

  } catch (error) {
      console.error("Error loading published courses:", error);
  }
}

function scrollCourses(direction) {
  const slider = document.getElementById("courseSlider");
  slider.scrollBy({ left: direction * 300, behavior: "smooth" });
}

document.getElementById("prevCourse").addEventListener("click", () => scrollCourses(-1));
document.getElementById("nextCourse").addEventListener("click", () => scrollCourses(1));

document.addEventListener("DOMContentLoaded", loadPublishedCourses);


// Enrolled Courses Start
async function loadEnrolledCourses() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "STUDENT") {
        alert("Access denied! Please log in as a student.");
        window.location.href = "signin_signup.html";
        return;
    }

    const studentId = user.id;

    try {
        const response = await fetch(`http://localhost:8080/api/courses/enrolled/${studentId}`);
        const enrolledCourses = await response.json();

        const tableBody = document.querySelector("#enrolledCoursesTable tbody");
        tableBody.innerHTML = ""; // Clear previous data

        enrolledCourses
            .filter(course => course.published) // ✅ Show only published courses
            .forEach(course => {
                let videoSrc = course.videoUrl && !course.videoUrl.startsWith("http")
                    ? `http://localhost:8080${course.videoUrl}`
                    : course.videoUrl;

                console.log("✅ Updated Course Video URL:", videoSrc); // Debugging Line

                tableBody.innerHTML += `
                    <tr>
                        <td>${course.title}</td>
                        <td>${course.description}</td>
                        <td>${course.price}</td>
                        <td>
                            ${videoSrc
                                ? `<video width="200" controls>
                                    <source src="${videoSrc}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>` 
                                : `<span>No Video Available</span>`
                            }
                        </td>
                    </tr>
                `;
            });

    } catch (error) {
        console.error("❌ Error fetching enrolled courses:", error);
        alert("Failed to load enrolled courses.");
    }
}


// async function loadEnrolledCourses() {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || user.role !== "STUDENT") {
//         alert("Access denied! Please log in as a student.");
//         window.location.href = "signin_signup.html";
//         return;
//     }

//     const studentId = user.id;

//     try {
//         const response = await fetch(`http://localhost:8080/api/courses/enrolled/${studentId}`);
//         const enrolledCourses = await response.json();

//         const tableBody = document.querySelector("#enrolledCoursesTable tbody");
//         tableBody.innerHTML = ""; // Clear previous data

//         enrolledCourses.forEach(course => {
//             let videoSrc = course.videoUrl ? `http://localhost:8080${course.videoUrl}` : null;
//             console.log("Updated Course Video URL:", videoSrc); // ✅ Debugging Line

//             tableBody.innerHTML += `
//                 <tr>
//                     <td>${course.title}</td>
//                     <td>${course.description}</td>
//                     <td>${course.price}</td>
//                     <td>
//                         ${videoSrc
//                             ? `<video width="200" controls>
//                                 <source src="${videoSrc}" type="video/mp4">
//                                 Your browser does not support the video tag.
//                             </video>` 
//                             : `<span>No Video Available</span>`
//                         }
//                     </td>
//                 </tr>
//             `;
//         });
//     } catch (error) {
//         console.error("Error fetching enrolled courses:", error);
//         alert("Failed to load enrolled courses.");
//     }
// }


// ✅ Call function on page load
document.addEventListener("DOMContentLoaded", loadEnrolledCourses);

// Enrolled Courses End

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

    // ✅ Ensure only STUDENT can access this page
    if (user.role !== "STUDENT") {
        alert("Unauthorized Access!");
        window.location.href = "../frontend/signin_signup.html";
    }

    // ✅ Prevent Back Button Navigation to Dashboard After Logout
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", function () {
        window.location.href = "../frontend/signin_signup.html";
    });
});
