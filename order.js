document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const productName = params.get("name") || "Garam Masala";
    const productImage = params.get("image") || "images/G1.jpeg";

    // Initial display price.
    // Actual price must also be verified by the server before payment.

    const price = 80;
    const minQuantity = 50;

    const nameElement = document.getElementById("productName");
    const imageElement = document.getElementById("productImage");
    const priceElement = document.getElementById("unitPrice");

    const quantityInput = document.getElementById("quantity");

    const displayQuantity = document.getElementById("displayQuantity");
    const displayPrice = document.getElementById("displayPrice");
    const totalAmount = document.getElementById("totalAmount");

    const form = document.getElementById("orderForm");

    nameElement.textContent = productName;
    imageElement.src = productImage;

    priceElement.textContent = price;
    displayPrice.textContent = price;

    quantityInput.min = minQuantity;
    quantityInput.value = minQuantity;

    // TOTAL CALCULATION

    function calculateTotal() {

        let quantity = parseInt(quantityInput.value, 10);

        if (isNaN(quantity) || quantity < 0) {
            quantity = 0;
        }

        displayQuantity.textContent = quantity;

        totalAmount.textContent = (
            quantity * price
        ).toLocaleString("en-IN");

    }

    quantityInput.addEventListener("input", calculateTotal);

    calculateTotal();


    // ORDER SUBMISSION

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();

        const mobile = document.getElementById("mobile").value.trim();

        const quantity = parseInt(quantityInput.value, 10);

        const address = document.getElementById("address").value.trim();

        if (!name || !mobile || !address) {

            alert("Please fill all required details.");

            return;
        }

        if (!/^[6-9][0-9]{9}$/.test(mobile)) {

            alert("Please enter a valid 10 digit mobile number.");

            return;
        }

        if (!Number.isInteger(quantity) || quantity < minQuantity) {

            alert("Minimum order quantity is 50 packets.");

            quantityInput.focus();

            return;
        }

        const total = quantity * price;

        // HN ENTERPRISES WhatsApp number
        // Change this number if required.

        const companyWhatsApp = "918294891066";

        const message =

`NEW ORDER ENQUIRY - HN ENTERPRISES

Customer Name: ${name}

Mobile Number: ${mobile}

Product: ${productName}

Quantity: ${quantity} Packets

Packet Size: 100 Grams

Price Per Packet: Rs. ${price}

Total Amount: Rs. ${total}

Delivery Address: ${address}

Estimated Delivery: 10 Days after order confirmation

Payment Status: Pending

Please contact the customer to confirm this order.

Thank you.
HN ENTERPRISES`;

        const whatsappURL =
            "https://wa.me/" +
            companyWhatsApp +
            "?text=" +
            encodeURIComponent(message);

        const confirmation = confirm(
            "Your order enquiry details are ready. Continue to WhatsApp?"
        );

        if (confirmation) {

            window.open(whatsappURL, "_blank");

        }

    });


    // CURRENT YEAR

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

});
