function toggleDropdown() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  }

  window.onclick = function (event) {
    if (!event.target.matches(".dropdown-icon")) {
      const dropdownMenu = document.getElementById("dropdownMenu");
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      }
    }
  };

  let selectedCourse = {};
  function openModal(courseName, coursePrice) {
    selectedCourse = { courseName, coursePrice };
    document.getElementById("modalCourseName").innerText = courseName;
    document.getElementById("modalCoursePrice").innerText = coursePrice;
    document.getElementById("paymentModal").style.display = "flex";
  }

  function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
  }

  function confirmPayment() {
    const paymentMethods = document.getElementsByName("paymentMethod");
    let selectedMethod = "";
    for (const method of paymentMethods) {
      if (method.checked) {
        selectedMethod = method.value;
      }
    }
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }
    document.getElementById("receiptCourseName").innerText =
      selectedCourse.courseName;
    document.getElementById("receiptCoursePrice").innerText =
      selectedCourse.coursePrice;
    document.getElementById("receiptPaymentMethod").innerText =
      selectedMethod;
    document.getElementById("paymentModal").style.display = "none";
    document.getElementById("receiptSection").style.display = "block";
  }

  function downloadReceipt() {
    const receiptContent = `
    Course: ${selectedCourse.courseName}\n
    Price: $${selectedCourse.coursePrice}\n
    Payment Method: ${
      document.getElementById("receiptPaymentMethod").innerText
    }\n
    Status: Successful
  `;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Receipt.txt";
    link.click();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".slider-track");
    const cards = document.querySelectorAll(".slider-card");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dots = document.querySelectorAll(".dot");

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth;

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
      updateSlider();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
      updateSlider();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });
    });
  });

  function redirectToCourse() {
    const isLoggedIn = localStorage.getItem("authToken"); 

    if (isLoggedIn) {
        window.location.href = "student_dashboard.html";
    } else {
        window.location.href = "signin_signup.html"; 
    }
  }
 
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