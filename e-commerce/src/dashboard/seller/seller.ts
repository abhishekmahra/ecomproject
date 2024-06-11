import { product } from "../../../interfaces";
let userLocalStorage = JSON.parse(localStorage.getItem('activeUser')!);
if(userLocalStorage){
  
let tempProduct: product;
// Function to fetch product data from the JSON server
function fetchData(activeUserID: string) {
  fetch(`http://localhost:8000/product?sellerID=${activeUserID}`)
    .then((response) => response.json())
    .then((products) => {
      renderProductCards(products);
    })
    .catch((error) => console.error("Error fetching product data:", error));
}

function postProductData(product: any) {
  fetch("http://localhost:8000/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add new product");
      }
      return response.json();
    })
    .then((newProduct) => {
      console.log("New product added:", newProduct);
    })
    .catch((error) => console.error("Error adding new product:", error));
}

// Function to create a product card
function createProductCard(product: product): HTMLElement {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
    <h3>${product.productName}</h3>
    <p>Stock: ${product.stock}</p>
    <p>Price: ₹ ${product.price}</p>
    <p>Description: ${product.description}</p>
    <button class="updateButton" product=${product}>Update</button>
    <button  style="background-color: red" productID=${product.id} class="product-btn">Delete</button>
  `;

  const updateButton = card.querySelector(".updateButton")!;
  updateButton.addEventListener("click", () => {
    (document.getElementById("productName") as HTMLInputElement).value =
      product.productName;
    (document.getElementById("stockQuantity") as HTMLInputElement).value =
      product.stock.toString();
    (document.getElementById("price") as HTMLInputElement).value =
      product.price.toString();
    (document.getElementById("description") as HTMLInputElement).value =
      product.description;
    (document.getElementById("add-pro-btn") as HTMLButtonElement).disabled =
      true;
    tempProduct = product;

    (document.getElementById("upd-btn") as HTMLButtonElement).disabled = false;
  });
  return card;
}

function renderProductCards(products: product[]) {
  const productCardsContainer = document.querySelector(".product-cards");
  productCardsContainer!.innerHTML = "";
  products.forEach((product) => {
    const card = createProductCard(product);
    productCardsContainer!.appendChild(card);
  });

  const deleteProductButton = document.querySelectorAll(".product-btn")!;

  deleteProductButton.forEach((button) => {
    button.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      const productID = target.getAttribute("productID")!;
      fetch(`http://localhost:8000/product/${productID}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add new product");
          }
        })
        .then(() => {
          window.location.reload();
        });
    });
  });
}
function handleAddProductForm(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const productName = form.productName.value.trim();
  const stockQuantity = form.stockQuantity.value.trim();
  const price = form.price.value.trim();
  const description = form.description.value.trim();

  if (!productName || !stockQuantity || !price || !description) {
    alert("Please fill out all fields");
    return;
  }

  const existingProducts = document.querySelectorAll(".product-card h3");
  const isDuplicate = Array.from(existingProducts).some(
    (card) => card.textContent === productName
  );
  if (isDuplicate) {
    alert("This product already exists!");
    return;
  }

  const newProduct = {
    sellerID: JSON.parse(localStorage.getItem("activeUser")!).id,
    productName: productName,
    stock: stockQuantity,
    price: price,
    description: description,
  };

  postProductData(newProduct);
  window.location.reload();
}

const addProductForm = document.getElementById("addProductForm");
addProductForm!.addEventListener("submit", handleAddProductForm);

document.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;
  if (target.classList.contains("add-to-cart-btn")) {
    const productCard = target.closest(".product-card") as HTMLElement;
    const productName = productCard.querySelector("h3")!.textContent;
    console.log(`Added ${productName} to cart`);
  }
});

let gotoLogout = document.getElementById("logoutBtn");
gotoLogout?.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.href = "/seller/seller.html";
});
const activeUserID = JSON.parse(localStorage.getItem("activeUser")!);
if (!activeUserID) {
  alert("No active user found.");
  window.location.href = "/login/login.html";
} else {
  fetchData(activeUserID.id);
}
document.getElementById("upd-btn")?.addEventListener("click", () => {
  // tempProduct = product;

  console.log("before update product data");
  console.log(tempProduct);

  const updateProductData: product = {
    id: tempProduct.id,
    sellerID: tempProduct.sellerID,
    quantity: tempProduct.quantity,
    productName: "",
    stock: 0,
    price: 0,
    description: "",
  };
  updateProductData.productName = (
    document.getElementById("productName") as HTMLInputElement
  ).value;
  updateProductData.stock = Number(
    (document.getElementById("stockQuantity") as HTMLInputElement).value
  );
  updateProductData.price = Number(
    (document.getElementById("price") as HTMLInputElement).value
  );
  updateProductData.description = (
    document.getElementById("description") as HTMLInputElement
  ).value;
  console.log("after update product details ");
  console.log(updateProductData);

  fetch(`http://localhost:8000/product/${updateProductData.id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateProductData),
  })
    .then((response) => {
      console.log("product updated", response);
      window.location.reload();
    })
    .catch((err) => {
      console.error("Error" + err);
    });
});
}
else{
  window.location.href = "src/login/login.html";
}


