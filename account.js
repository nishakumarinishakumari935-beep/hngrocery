const token = localStorage.getItem("hnCustomerToken");
const customerData = localStorage.getItem("hnCustomer");

if (!token || !customerData) {

    alert("Please login to access your account.");

    window.location.href = "login.html";

} else {

    try {

        const customer = JSON.parse(customerData);

        document.getElementById("customerName").textContent =
            customer.name || "Customer";

        document.getElementById("customerMobile").textContent =
            customer.mobile || "";

    } catch (error) {

        localStorage.removeItem("hnCustomer");
        localStorage.removeItem("hnCustomerToken");

        window.location.href = "login.html";

    }
}

document.getElementById("logoutBtn").addEventListener("click", function () {

    localStorage.removeItem("hnCustomerToken");
    localStorage.removeItem("hnCustomer");

    alert("You have logged out successfully.");

    window.location.href = "login.html";

});
