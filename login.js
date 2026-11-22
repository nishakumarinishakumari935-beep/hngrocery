const API_BASE = "https://hn-payment-backend.onrender.com";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

let otpSent = false;

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const mobile = document.getElementById("mobile").value.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        message.textContent = "Please enter a valid 10 digit mobile number.";
        return;
    }

    if (!otpSent) {
        try {
            loginBtn.disabled = true;
            message.textContent = "Sending OTP...";

            const response = await fetch(`${API_BASE}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mobile: mobile,
                    purpose: "login"
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "OTP could not be sent.");
            }

            const otpInput = document.createElement("input");
            otpInput.type = "text";
            otpInput.id = "otp";
            otpInput.placeholder = "Enter OTP";
            otpInput.maxLength = 6;
            otpInput.required = true;

            loginForm.insertBefore(otpInput, loginBtn);

            otpSent = true;
            loginBtn.textContent = "Verify OTP";
            message.textContent = "OTP sent successfully.";

        } catch (error) {
            message.textContent = error.message;
        } finally {
            loginBtn.disabled = false;
        }

        return;
    }

    const otp = document.getElementById("otp").value.trim();

    if (!/^\d{6}$/.test(otp)) {
        message.textContent = "Please enter the 6 digit OTP.";
        return;
    }

    try {
        loginBtn.disabled = true;
        message.textContent = "Verifying OTP...";

        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mobile: mobile,
                otp: otp
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "OTP verification failed.");
        }

        localStorage.setItem("hnCustomerToken", data.token);
        localStorage.setItem("hnCustomer", JSON.stringify(data.customer));

        message.textContent = "Login successful!";

        window.location.href = "customer-dashboard.html";

    } catch (error) {
        message.textContent = error.message;
    } finally {
        loginBtn.disabled = false;
    }
});
