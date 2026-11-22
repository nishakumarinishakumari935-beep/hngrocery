 /* HN ENTERPRISES PAYMENT SYSTEM */


/* CURRENT YEAR */

document.getElementById("currentYear").textContent =
new Date().getFullYear();


/* GET ORDER DETAILS */

let order;

try {

order = JSON.parse(
localStorage.getItem("hnOrder")
);

} catch(error) {

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


/* PAYMENT METHOD */

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
"UPI payment through Google Pay, PhonePe or Paytm will be available after secure payment gateway setup.";

confirmButton.textContent =
"Continue to UPI Payment";

}

else if (this.value === "CARD") {

paymentMessage.textContent =
"Debit and Credit Card payments will be available after secure payment gateway setup.";

confirmButton.textContent =
"Continue to Card Payment";

}

});

});


/* CONFIRM PAYMENT */

confirmButton.addEventListener("click", function() {

const selectedPayment =
document.querySelector('input[name="payment"]:checked').value;


/* COD PAYMENT */

if (selectedPayment === "COD") {

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

return;

}


/* ONLINE PAYMENT */

if (selectedPayment === "UPI" ||
selectedPayment === "CARD") {

alert(
"Online payment gateway is not connected yet. Please select Cash on Delivery for now. UPI and Card payments will work after secure gateway integration."
);

}

});

}
