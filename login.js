const API_BASE = "https://hn-payment-backend.onrender.com";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

let otpSent = false;

loginForm.addEventListener("submit", async function (e) {

e.preventDefault();

const mobileInput = document.getElementById("mobile");
const mobile = mobileInput.value.trim();

message.style.color = "#d9534f";

if (!/^[6-9]\d{9}$/.test(mobile)) {
    message.textContent =
        "Please enter a valid 10 digit mobile number.";
    return;
}

// SEND OTP

if (!otpSent) {

    try {

        loginBtn.disabled = true;
        message.style.color = "#198754";
        message.textContent = "Sending OTP... Please wait.";

        const response = await fetch(`${API_BASE}/send-otp`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mobile: mobile,
                purpose: "login"
            })

        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "OTP could not be sent."
            );
        }

        // CREATE OTP INPUT

        const otpInput = document.createElement("input");

        otpInput.type = "text";
        otpInput.id = "otp";
        otpInput.placeholder = "Enter 6 digit OTP";
        otpInput.maxLength = 6;
        otpInput.inputMode = "numeric";
        otpInput.autocomplete = "one-time-code";
        otpInput.required = true;

        otpInput.style.width = "100%";
        otpInput.style.padding = "15px";
        otpInput.style.marginBottom = "15px";
        otpInput.style.border = "1px solid #198754";
        otpInput.style.borderRadius = "9px";
        otpInput.style.fontSize = "16px";

        loginForm.insertBefore(otpInput, loginBtn);

        otpSent = true;

        loginBtn.textContent = "Verify OTP";

        message.style.color = "#198754";
        message.textContent =
            "OTP sent successfully. Please enter your OTP.";

        otpInput.focus();

    } catch (error) {

        message.style.color = "#d9534f";
        message.textContent = error.message;

    } finally {

        loginBtn.disabled = false;

    }

    return;
}

// VERIFY OTP

const otpInput = document.getElementById("otp");

const otp = otpInput.value.trim();

if (!/^\d{6}$/.test(otp)) {

    message.textContent =
        "Please enter the correct 6 digit OTP.";

    otpInput.focus();

    return;
}

try {

    loginBtn.disabled = true;

    message.style.color = "#198754";
    message.textContent = "Verifying OTP...";

    const response = await fetch(`${API_BASE}/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            mobile: mobile,
            otp: otp
        })

    });

    const data = await response.json();

    if (!response.ok || !data.success) {

        throw new Error(
            data.message || "OTP verification failed."
        );

    }

    if (!data.token || !data.customer) {

        throw new Error(
            "Login response is incomplete. Please try again."
        );

    }

    // SAVE CUSTOMER INFORMATION

    localStorage.setItem(
        "hnCustomerToken",
        data.token
    );

    localStorage.setItem(
        "hnCustomer",
        JSON.stringify(data.customer)
    );

    message.style.color = "#198754";
    message.textContent =
        "Login successful! Welcome to HN GROCERY.";

    // OPEN CUSTOMER DASHBOARD

    setTimeout(function () {

        window.location.href = "customer-dashboard.html";

    }, 700);

} catch (error) {

    message.style.color = "#d9534f";
    message.textContent = error.message;

} finally {

    loginBtn.disabled = false;

}

});
