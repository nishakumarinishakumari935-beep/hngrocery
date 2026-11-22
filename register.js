const API_BASE = "https://hn-payment-backend.onrender.com";

const registerForm = document.getElementById("registerForm");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

let otpSent = false;

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        message.textContent = "Please enter a valid 10 digit mobile number.";
        return;
    }

    if (!otpSent) {

        try {
            registerBtn.disabled = true;
            message.textContent = "Sending OTP...";

            const response = await fetch(`${API_BASE}/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile,
                    purpose: "register"
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "OTP could not be sent.");
            }

            const otpInput = document.createElement("input");

            otpInput.type = "text";
            otpInput.id = "otp";
            otpInput.placeholder = "Enter 6 digit OTP";
            otpInput.maxLength = 6;
            otpInput.required = true;
            otpInput.style.marginTop = "15px";

            registerForm.insertBefore(otpInput, registerBtn);

            otpSent = true;
            registerBtn.textContent = "Verify OTP & Register";

            message.textContent = "OTP sent successfully.";

        } catch (error) {
            message.textContent = error.message;
        } finally {
            registerBtn.disabled = false;
        }

        return;
    }

    const otp = document.getElementById("otp").value.trim();

    if (!/^\d{6}$/.test(otp)) {
        message.textContent = "Please enter the 6 digit OTP.";
        return;
    }

    try {

        registerBtn.disabled = true;
        message.textContent = "Creating your account...";

        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                mobile: mobile,
                email: email,
                address: address,
                otp: otp
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Registration failed.");
        }

        localStorage.setItem("hnCustomerToken", data.token);
        localStorage.setItem("hnCustomer", JSON.stringify(data.customer));

        message.textContent = "Account created successfully!";

        window.location.href = "customer-dashboard.html";

    } catch (error) {
        message.textContent = error.message;
    } finally {
        registerBtn.disabled = false;
    }

});
