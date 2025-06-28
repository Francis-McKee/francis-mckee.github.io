var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

function addToCart(itemName, itemUrl) {
    cartItems.push({ name: itemName, url: itemUrl });
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    showMessage("Item added to cart: " + itemName);
}

var clearCartButton = document.getElementById("clear-cart-button");
clearCartButton.addEventListener("click", function () {
    cartItems = [];
    sessionStorage.removeItem("cartItems");
    displayCartItems();
    showMessage("Cart cleared");
    closeCartModal();
});

function displayCartItems() {
    var cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    if (cartItems.length > 0) {
        for (var i = 0; i < cartItems.length; i++) {
            var listItem = document.createElement("li");
            listItem.textContent = cartItems[i].name;
            cartList.appendChild(listItem);
        }
    } else {
        cartList.innerHTML = "<li>Cart is empty</li>";
    }
}

var addToCartButtons = document.querySelectorAll(".add-to-cart-button");
addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        var itemName = this.getAttribute("data-item");
        var itemUrl = this.getAttribute("data-url");
        addToCart(itemName, itemUrl);
    });
});

var viewCartButton = document.getElementById("view-cart-button");
var cartModal = document.getElementById("cart-modal");

viewCartButton.addEventListener("click", function () {
    openCartModal();
    displayCartItems();
});

function openCartModal() {
    cartModal.style.display = "block";
}

function closeCartModal() {
    cartModal.style.display = "none";
}

var closeCartButton = document.getElementById("close-cart-modal");
closeCartButton.onclick = function () {
    closeCartModal();
};

var processOrderButton = document.getElementById("process-order-button");
processOrderButton.addEventListener("click", function () {
    if (cartItems.length === 0) {
        showMessage("Your cart is empty.");
        return;
    }

    for (var i = 0; i < cartItems.length; i++) {
        window.open(cartItems[i].url, "_blank");
    }

    showMessage("Opening Gumroad checkout...");
    closeCartModal();
});

function showMessage(messageText) {
    var messageContainer = document.getElementById("login-message");
    if (messageContainer) {
        messageContainer.textContent = messageText;
        messageContainer.style.display = "block";

        // Automatically hide the message after 3 seconds
        setTimeout(function () {
            messageContainer.style.display = "none";
        }, 3000);
    }
}