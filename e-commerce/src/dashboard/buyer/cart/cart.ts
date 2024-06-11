let userLocalStorage = JSON.parse(localStorage.getItem('activeUser')!);
if(userLocalStorage){
  
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(
    ".cart-items"
  ) as HTMLDivElement;
  const totalPriceElement = document.getElementById(
    "total-price"
  ) as HTMLSpanElement;
  const checkoutButton = document.getElementById(
    "checkout-btn"
  ) as HTMLButtonElement;

  const activeUser = JSON.parse(localStorage.getItem("activeUser")!).id;
  if (!activeUser) {
    alert("No active user found.");
    window.location.href = "/index.html";
    return;
  }

  fetch(`http://localhost:8000/carts?buyerId=${activeUser}`)
    .then((response) => response.json())
    .then((cartItems: any[]) => {
      cartItemsContainer.innerHTML = "";

      cartItems.forEach((cartItem) => {
        fetch(`http://localhost:8000/product/${cartItem.productId}`)
          .then((response) => response.json())
          .then((product) => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
            cartItemElement.innerHTML = `
                <div>${product.productName}</div>
                <div>Price: ₹${product.price}</div>
                <div>Quantity: ${cartItem.quantity}</div>
                <button class="remove-btn" data-cartItemId="${cartItem.id}">Remove</button>
              `;
            cartItemsContainer.appendChild(cartItemElement);

            updateTotalPrice();
          });
      });
    });

  cartItemsContainer.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).classList.contains("remove-btn")) {
      const cartItemId = (event.target as HTMLElement).dataset.cartitemid!;
      fetch(`http://localhost:8000/carts/${cartItemId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to remove item from cart");
          }

          (event.target as HTMLElement).closest(".cart-item")!.remove();

          updateTotalPrice();
        })
        .catch((error) =>
          console.error("Error removing item from cart:", error)
        );
    }
  });

  function updateTotalPrice() {
    const cartItems = document.querySelectorAll(".cart-item");
    let totalPrice = 0;
    cartItems.forEach((cartItem) => {
      const price = parseFloat(
        (
          cartItem.querySelector("div:nth-child(2)") as HTMLDivElement
        ).textContent!.replace("Price: ₹", "")
      );
      const quantity = parseInt(
        (
          cartItem.querySelector("div:nth-child(3)") as HTMLDivElement
        ).textContent!.split(":")[1]
      );
      totalPrice += price * quantity;
    });
    totalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;
  }

  checkoutButton.addEventListener("click", () => {
    handleCheckout();
    function handleCheckout() {
      const buyerId = JSON.parse(localStorage.getItem("activeUser")!).id;

      fetchCartDataForUser(buyerId)
        .then((cartData) => {
          if (cartData.length === 0) {
            alert(
              "Your cart is empty. Please add items before proceeding to checkout."
            );
            return;
          }

          return appendToCartHistory(cartData, buyerId);
        })
        .then((response) => {
          console.log("Cart data appended to cart history:", response);
        })
        .catch((error) => {
          console.error("Error handling checkout:", error);
        });
    }
    async function fetchCartDataForUser(buyerId: string) {
      const response = await fetch(
        `http://localhost:8000/carts?buyerId=${buyerId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }
      return await response.json();
    }
    async function appendToCartHistory(cartData: any[], buyerId: string) {
      const orderHistory = {
        buyerId: buyerId,
        orders: cartData,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:8000/cartHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderHistory),
      });
      if (!response.ok) {
        throw new Error("Failed to append data to cart history");
      }
      return await response.json();
    }
    fetch(`http://localhost:8000/carts?buyerId=${activeUser}`)
      .then((response) => response.json())
      .then((cartItems: any[]) => {
        cartItems.map((cartItem) => {
          return fetch(`http://localhost:8000/carts/${cartItem.id}`, {
            method: "DELETE",
          }).then((response) => {
            console.log(response);
            window.location.reload();
            // window.location.href = "order/order.html";
          });
        });
      })
      .catch((error) => console.error("Error fetching cart items:", error));
  });
  let orderBtn = document.getElementById("orderHistoryButton");
  orderBtn?.addEventListener("click", () => {
    window.location.href = "order/order.html";
  });
});

}
else{
  window.location.href = "src/login/login.html";
}
