 let userStorage = JSON.parse(localStorage.getItem('activeUser')!);
if(userStorage){
  
function createCard(product: any): HTMLElement {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
  <pre>Product ID: <span class="product-id">${product.id}</span></pre>
      <h3>${product.productName}</h3>
      <p class="stock-value">Stock: <span class="stock">${product.stock}</span></p>
      <p>Price: Rs. ${product.price}</p>
      <p>Description: ${product.description}</p>
      <div style="padding: 10px">
        <lable>Quantity:</lable>
        <input name="quantity" style="width: 50px, height:30px" type="number" min="1" max="${product.stock}" value="1"/>
      </div>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;
  return card;
}

function renderCards(products: any[]) {
  const productCardsContainer = document.querySelector(".product-cards");
  productCardsContainer!.innerHTML = "";
  products.forEach((product) => {
    const card = createCard(product);
    productCardsContainer!.appendChild(card);
  });
}

function fetchProductData() {
  fetch("http://localhost:8000/product")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
      return response.json();
    })
    .then((products) => {
      renderCards(products);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error.message);
    });
}
document.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;
  if (target.classList.contains("add-to-cart-btn")) {
    const productCard = target.closest(".product-card") as HTMLElement;
    const productIdElement = productCard.querySelector(
      ".product-id"
    ) as HTMLElement;
    const productId = productIdElement.textContent;
    const buyerId = JSON.parse(localStorage.getItem("activeUser")!).id;
    const quantityInput = productCard.querySelector(
      'input[name="quantity"]'
    ) as HTMLInputElement;
    const quantity = parseInt(quantityInput.value);
    const cartItem = { productId, buyerId, quantity };

    fetch(
      `http://localhost:8000/carts?productId=${productId}&buyerId=${buyerId}`
    )
      .then((response) => response.json())
      .then((existingCartItems) => {
        if (existingCartItems.length > 0) {
          const existingCartItem = existingCartItems[0];
          const newQuantity = existingCartItem.quantity + quantity;
          const sellerStock = parseInt(
            productCard.querySelector(".stock")!.textContent!
          );
          if (newQuantity <= sellerStock) {
            fetch(`http://localhost:8000/carts/${existingCartItem.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ quantity: newQuantity }),
            })
              .then(() => {
                window.location.reload();
              })
              .catch((error) =>
                console.error("Error updating item quantity:", error)
              );
          } else {
            console.log("Quantity exceeds stock.");
          }
        } else {
          fetch("http://localhost:8000/carts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cartItem),
          })
            .then(() => {
              window.location.reload();
            })
            .catch((error) =>
              console.error("Error adding item to cart:", error)
            );
        }
      })
      .catch((error) =>
        console.error("Error checking existing cart items:", error)
      );
  }
});

let routeToLogOut = document.getElementById("logoutBtn");
routeToLogOut?.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.href = "/index.html";
});

let cartBtn = document.getElementById("cartBtn");
cartBtn?.addEventListener("click", () => {
  window.location.href = "cart/cart.html";
});
window.addEventListener("DOMContentLoaded", () => {
  fetchProductData();
});

}
else{
  window.location.href = "src/login/login.html";
}
