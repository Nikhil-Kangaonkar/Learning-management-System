document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    if (!courseId) {
        alert("Course ID is missing!");
        window.location.href = "index.html"; // Redirect if no course ID
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to load course details");
        const course = await response.json();

        // ✅ Update course details dynamically
        document.getElementById("courseImage").src = course.thumbnailUrl || "/Images/default.png";
        document.getElementById("courseTitle").textContent = course.title || "No title available";
        document.getElementById("courseShortDescription").textContent = course.description || "No short description available";
        document.getElementById("courseLongDescription").textContent = course.longDescription || "No long description available.";
        document.getElementById("courseBatch").textContent = course.batch || "Not specified";
        document.getElementById("courseTiming").textContent = course.timing || "Not specified";
        document.getElementById("courseDuration").textContent = course.duration || "Not specified";
        document.getElementById("courseMode").textContent = course.mode || "Not specified";
        document.getElementById("courseFees").textContent = `${course.price || "0"}`;


        // ✅ Instructor details
        document.getElementById("instructorName").textContent = course.instructorName || "Unknown Instructor";
        document.getElementById("instructorBio").textContent = course.instructorBio || "No instructor bio available.";

        // ✅ Enroll button logic
        // const enrollButton = document.getElementById("enrollButton");
        // enrollButton.addEventListener("click", function (e) {
        //     e.preventDefault();
        //     const user = JSON.parse(localStorage.getItem("user"));

        //     if (!user) {
        //         alert("❌ Please log in to enroll in this course!");
        //         window.location.href = "signin_signup.html"; // Redirect to login if not logged in
        //     } else {
        //         window.location.href = `payment.html?courseId=${courseId}`; // Redirect to payment page
        //     }
        // });
        document.getElementById("enrollButton").addEventListener("click", async function (e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("user"));
            const params = new URLSearchParams(window.location.search);
            const courseId = params.get("id"); // ✅ Ensure courseId is retrieved correctly
        
            if (!user) {
                alert("❌ Please log in to enroll in this course!");
                window.location.href = "signin_signup.html"; // Redirect to login if not logged in
                return;
            }
        
            if (user.role !== "STUDENT") {
                alert("❌ Only students can enroll in courses!");
                return;
            }
        
            try {
                const response = await fetch("http://localhost:8080/api/enrollments/enroll", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ studentId: user.id, courseId: courseId }),
                });
        
                if (response.ok) {
                    alert("✅ Successfully enrolled in the course!");
                    window.location.href = "student.html"; // Redirect to student dashboard
                } else {
                    const errorText = await response.text();
                    alert(`❌ Enrollment failed: ${errorText}`);
                }
            } catch (error) {
                console.error("Error enrolling in course:", error);
                alert("❌ Something went wrong. Try again later.");
            }
        });
        

    } catch (error) {
        console.error("❌ Error fetching course details:", error);
        alert("❌ Error loading course details. Please try again.");
    }
});
