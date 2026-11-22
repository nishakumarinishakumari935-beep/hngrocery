 /* HN ENTERPRISES RAZORPAY PAYMENT SYSTEM */

const API_URL = "https://hn-payment-backend.onrender.com";

/* CURRENT YEAR */

const yearElement = document.getElementById("currentYear");

if (yearElement) {
yearElement.textContent = new Date().getFullYear();
}

/* GET ORDER DETAILS */

let order;

try {
order = JSON.parse(localStorage.getItem("hnOrder"));
} catch (error) {
order = null;
}

/* CHECK ORDER */

if (!order) {
alert("Order details not found. Please place your order again.");
window.location.replace("order.html");

} else {

/* DISPLAY ORDER DETAILS */

document.getElementById("paymentImage").src =
    order.productImage || "images/G1.jpeg";

document.getElementById("paymentProduct").textContent =
    order.productName;

document.getElementById("paymentPrice").textContent =
    order.price;

document.getElementById("paymentQuantity").textContent =
    order.quantity;

document.getElementById("customerName").textContent =
    order.customerName;

document.getElementById("customerMobile").textContent =
    order.mobile;

document.getElementById("customerAddress").textContent =
    order.address;

document.getElementById("paymentTotal").textContent =
    Number(order.totalAmount).toFixed(2);


/* FORMAT DATES */

function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

document.getElementById("orderDate").textContent =
    formatDate(order.orderDate);

document.getElementById("deliveryDate").textContent =
    formatDate(order.deliveryDate);


/* PAYMENT ELEMENTS */

const paymentOptions =
    document.querySelectorAll('input[name="payment"]');

const paymentMessage =
    document.getElementById("paymentMessage");

const confirmButton =
    document.getElementById("confirmPayment");


/* UPDATE PAYMENT MESSAGE */

paymentOptions.forEach(function(option) {

    option.addEventListener("change", function() {

        if (this.value === "COD") {

            paymentMessage.textContent =
                "Cash on Delivery: Pay when your order arrives.";

            confirmButton.textContent =
                "Confirm Cash on Delivery Order";

        }

        else if (this.value === "UPI") {

            paymentMessage.textContent =
                "Pay securely using UPI through Razorpay Test Checkout.";

            confirmButton.textContent =
                "Continue to UPI Payment";

        }

        else if (this.value === "CARD") {

            paymentMessage.textContent =
                "Pay securely using Debit or Credit Card through Razorpay Test Checkout.";

            confirmButton.textContent =
                "Continue to Card Payment";

        }

    });

});


/* COD ORDER */

function confirmCOD() {

    const confirmedOrder = {
        ...order,

        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pay on Delivery",
        orderStatus: "Pending Confirmation"
    };

    localStorage.setItem(
        "hnOrder",
        JSON.stringify(confirmedOrder)
    );

    localStorage.setItem(
        "hnLastOrder",
        JSON.stringify(confirmedOrder)
    );

    window.location.href = "success.html";
}


/* RAZORPAY ONLINE PAYMENT */

async function startRazorpayPayment(selectedPayment) {

    try {

        confirmButton.disabled = true;
        confirmButton.textContent = "Connecting to Payment Gateway...";

        const totalAmount = Number(order.totalAmount);

        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            throw new Error("Invalid order amount.");
        }

        // Convert rupees into paise

        const amountInPaise = Math.round(totalAmount * 100);

        // CREATE RAZORPAY ORDER

        const response = await fetch(
            API_URL + "/create-order",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount: amountInPaise
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to create payment order."
            );
        }


        // RAZORPAY CHECKOUT OPTIONS

        const options = {

            key: result.keyId,

            amount: result.amount,

            currency: result.currency,

            name: "HN ENTERPRISES",

            description: "Order Payment",

            order_id: result.orderId,

            prefill: {
                name: order.customerName,
                contact: order.mobile
            },

            notes: {
                product: order.productName,
                quantity: String(order.quantity)
            },

            theme: {
                color: "#8B4513"
            },


            // PAYMENT SUCCESS HANDLER

            handler: async function(paymentResponse) {

                try {

                    paymentMessage.textContent =
                        "Verifying your payment...";

                    const verifyResponse = await fetch(
                        API_URL + "/verify-payment",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,

                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,

                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            })
                        }
                    );

                    const verifyResult =
                        await verifyResponse.json();

                    if (!verifyResponse.ok || !verifyResult.success) {

                        throw new Error(
                            "Payment verification failed."
                        );
                    }


                    // SAVE VERIFIED ORDER

                    const paidOrder = {

                        ...order,

                        paymentMethod: selectedPayment === "UPI"
                            ? "UPI"
                            : "Card / Online",

                        paymentStatus: "Paid",

                        orderStatus: "Payment Successful",

                        razorpayOrderId:
                            paymentResponse.razorpay_order_id,

                        razorpayPaymentId:
                            paymentResponse.razorpay_payment_id

                    };

                    localStorage.setItem(
                        "hnOrder",
                        JSON.stringify(paidOrder)
                    );

                    localStorage.setItem(
                        "hnLastOrder",
                        JSON.stringify(paidOrder)
                    );

                    alert("Payment successful! Thank you.");

                    window.location.href = "success.html";

                } catch (error) {

                    alert(
                        "Payment verification error: " + error.message
                    );

                    confirmButton.disabled = false;

                    confirmButton.textContent =
                        "Try Again";
                }

            },


            modal: {
                ondismiss: function() {

                    confirmButton.disabled = false;

                    confirmButton.textContent =
                        "Continue to Payment";

                    paymentMessage.textContent =
                        "Payment was not completed. You can try again.";
                }
            }

        };


        // OPEN RAZORPAY CHECKOUT

        const razorpayCheckout =
            new Razorpay(options);

        razorpayCheckout.on("payment.failed", function(response) {

            alert(
                "Payment failed: " +
                response.error.description
            );

            confirmButton.disabled = false;

            confirmButton.textContent =
                "Try Payment Again";

        });

        razorpayCheckout.open();

    }

    catch (error) {

        alert("Payment Error: " + error.message);

        confirmButton.disabled = false;

        confirmButton.textContent =
            "Continue to Payment";

    }

}


/* CONFIRM BUTTON */

confirmButton.addEventListener("click", function() {

    const selectedOption =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!selectedOption) {
        alert("Please select a payment method.");
        return;
    }

    const selectedPayment = selectedOption.value;

    if (selectedPayment === "COD") {

        confirmCOD();

    }

    else if (
        selectedPayment === "UPI" ||
        selectedPayment === "CARD"
    ) {

        if (typeof Razorpay === "undefined") {

            alert("Razorpay Checkout is not loaded. Please refresh the page.");

            return;
        }

        startRazorpayPayment(selectedPayment);

    }

});

}
