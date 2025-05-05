// // ✅ Toggle Functionality (Sign In / Sign Up Mode)
// const signInBtn = document.querySelector("#sign-in-btn");
// const signUpBtn = document.querySelector("#sign-up-btn");
// const container = document.querySelector(".container");

// signUpBtn.addEventListener("click", () => {
//   container.classList.add("sign-up-mode");
// });

// signInBtn.addEventListener("click", () => {
//   container.classList.remove("sign-up-mode");
// });

// // ✅ Wait for the document to fully load
// document.addEventListener("DOMContentLoaded", function () {
//     console.log("✅ JavaScript file loaded successfully!");

//     const loginForm = document.getElementById("loginForm");
//     const signUpForm = document.getElementById("signUpForm");

//     if (!signUpForm) {
//         console.warn("⚠️ Sign-Up Form not found! Make sure your HTML has a form with id='signUpForm'.");
//     }
//     if (!loginForm) {
//         console.warn("⚠️ Login Form not found! Make sure your HTML has a form with id='loginForm'.");
//     }

//     // ✅ Validation Functions
//     function isValidEmail(email) {
//         const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,3})+$/;
//         return emailRegex.test(email);
//     }

//     function isValidPassword(password) {
//         return password.length >= 7 && password.length <= 12;
//     }

//     function isValidName(name) {
//         const nameRegex = /^[A-Za-z]+$/;
//         return nameRegex.test(name);
//     }

//     // ✅ Handle Sign-Up Form Submission
//     if (signUpForm) {
//         signUpForm.addEventListener("submit", async function (event) {
//             event.preventDefault(); // Prevent form refresh

//             const name = document.getElementById("username").value.trim();
//             const email = document.getElementById("signup-email").value.trim();
//             const password = document.getElementById("signup-password").value;
//             const role = "STUDENT"; // Default role for sign-up

//             if (!isValidName(name)) {
//                 alert("❌ Name must contain only letters.");
//                 return;
//             }
//             if (!isValidEmail(email)) {
//                 alert("❌ Invalid email format.");
//                 return;
//             }
//             if (!isValidPassword(password)) {
//                 alert("❌ Password should be between 7 to 12 characters.");
//                 return;
//             }

//             try {
//                 const response = await fetch("http://localhost:8080/api/auth/signup", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ name, email, password, role }),
//                 });

//                 const data = await response.json();
//                 console.log("Sign-Up Response Data:", data);

//                 if (response.ok) {
//                     alert("✅ Sign-Up Successful! Please log in.");
//                     window.location.href = "signin_signup.html"; // Redirect to login page
//                 } else {
//                     alert("❌ Sign-Up Failed: " + data.message);
//                 }
//             } catch (error) {
//                 console.error("❌ Error during sign-up:", error);
//                 alert("❌ An error occurred. Please try again later.");
//             }
//         });
//     }

//     // ✅ Handle Sign-In Form Submission
//     if (loginForm) {
//         loginForm.addEventListener("submit", async function (event) {
//             event.preventDefault(); // Prevent form refresh

//             const email = document.getElementById("email").value.trim();
//             const password = document.getElementById("password").value;

//             if (!isValidEmail(email)) {
//                 alert("❌ Invalid email format.");
//                 return;
//             }
//             if (!isValidPassword(password)) {
//                 alert("❌ Password should be between 7 to 12 characters.");
//                 return;
//             }

//             try {
//                 const response = await fetch("http://localhost:8080/api/auth/login", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ email, password }),
//                 });

//                 const data = await response.json();
//                 console.log("Login Response Data:", data);

//                 if (response.ok) {
//                     localStorage.setItem("user", JSON.stringify(data)); // Store user info
//                     alert("✅ Sign-In Successful!");

//                     if (data.role === "ADMIN") {
//                         window.location.href = "/frontend/admin.html";
//                     } else if (data.role === "STUDENT") {
//                         window.location.href = "/frontend/student.html";
//                     }
//                 } else {
//                     alert("❌ Invalid credentials. Please try again.");
//                 }
//             } catch (error) {
//                 console.error("❌ Error during login:", error);
//                 alert("❌ An error occurred. Please try again later.");
//             }
//         });
//     }
// });
// ✅ Toggle Functionality (Sign In / Sign Up Mode)
const signInBtn = document.querySelector("#sign-in-btn");
const signUpBtn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

signUpBtn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

signInBtn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// ✅ Wait for the document to fully load
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript file loaded successfully!");

    const loginForm = document.getElementById("loginForm");
    const signUpForm = document.getElementById("signUpForm");

    if (!signUpForm) {
        console.warn("⚠️ Sign-Up Form not found!");
    }
    if (!loginForm) {
        console.warn("⚠️ Login Form not found!");
    }

    // ✅ Validation Functions
    function isValidEmail(email) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        return password.length >= 7 && password.length <= 12;
    }

    function isValidName(name) {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(name);
    }

    // ✅ Handle Sign-Up Form Submission
    if (signUpForm) {
        signUpForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent form refresh

            const name = document.getElementById("username").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value;
            const role = "STUDENT"; // ✅ Role Always set to "STUDENT"

            if (!isValidName(name)) {
                alert("❌ Name must contain only letters.");
                return;
            }
            if (!isValidEmail(email)) {
                alert("❌ Invalid email format.");
                return;
            }
            if (!isValidPassword(password)) {
                alert("❌ Password should be between 7 to 12 characters.");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role }), // ✅ Send selected role
                });

                const data = await response.json();
                console.log("Sign-Up Response Data:", data);

                if (response.ok) {
                    alert("✅ Sign-Up Successful! Please log in.");
                    window.location.href = "signin_signup.html"; // Redirect to login page
                } else {
                    alert("❌ Sign-Up Failed: " + (data.message || "Please try again."));
                }
            } catch (error) {
                console.error("❌ Error during sign-up:", error);
                alert("❌ An error occurred. Please try again later.");
            }
        });
    }

    // ✅ Handle Sign-In Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent form refresh

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!isValidEmail(email)) {
                alert("❌ Invalid email format.");
                return;
            }
            if (!isValidPassword(password)) {
                alert("❌ Password should be between 7 to 12 characters.");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    alert("❌ Invalid credentials. Please try again.");
                    return;
                }

                const data = await response.json();
                console.log("Login Response Data:", data);

                // ✅ Store both user info & auth token in localStorage
                localStorage.setItem("user", JSON.stringify(data));
                localStorage.setItem("authToken", data.token); // Store token for authentication

                alert("✅ Sign-In Successful!");

                // ✅ Redirect user based on role
            if (data.role === "ADMIN") {
                window.location.href = "/frontend/admin.html";
            } else if (data.role === "STUDENT") {
                window.location.href = "/frontend/student.html";
            }
        } catch (error) {
            console.error("❌ Error during login:", error);
            alert("❌ An error occurred. Please try again later.");
        }
    });
}    
    // ✅ Auto Logout when user presses Back button
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            console.log("🔄 Back button detected - Logging out user.");
            localStorage.removeItem("user"); // ✅ Remove user session
            window.location.href = "signin_signup.html"; // ✅ Redirect to Login Page
        }
    });
});
