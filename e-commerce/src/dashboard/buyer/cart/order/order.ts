let userLocal = JSON.parse(localStorage.getItem('activeUser')!);
if(userLocal){
  async function fetchOrderHistoryForUser() {
    const buyerId = JSON.parse(localStorage.getItem("activeUser")!).id;
    const response = await fetch(`http://localhost:8000/cartHistory`);
    if (!response.ok) {
        throw new Error("Failed to fetch order history");
    }
    const cartHistory = await response.json();
    const userOrders = [];
    for (const item of cartHistory) {
        for (const order of item.orders) {
            if (order.buyerId === buyerId) {
                try {
                    const productResponse = await fetch(`http://localhost:8000/product/${order.productId}`);
                    if (!productResponse.ok) {
                        throw new Error("Failed to fetch product details");
                    }
                    const product = await productResponse.json();
                    order.productName = product.productName;
                    order.timestamp = item.timestamp;
                    userOrders.push(order);
                } catch (error) {
                    console.error("Error fetching product details:", error);
                }
            }
        }
    }
    return userOrders;
}


function renderOrderHistory(orderHistory: any[]) {
  const orderHistoryContainer = document.querySelector(
    "#orderHistoryContainer"
  );
  orderHistoryContainer!.innerHTML = "";
  orderHistory.forEach(
    (order: {
      id: string;
      productId: String;
      productName: string;
      quantity: number;
      timestamp: string;
    }) => {
      const orderElement = document.createElement("div");
      orderElement.classList.add("order");
      orderElement.innerHTML = `
            <p>Order ID: ${order.id}</p>
            <p>Product ID: ${order.productId}</p>
            <p>Product Name :${order.productName}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Timestamp: ${order.timestamp}</p>
        `;
      orderHistoryContainer!.appendChild(orderElement);
    }
  );
}

// Event listener for displaying order history
document.addEventListener("DOMContentLoaded", () => {
  fetchOrderHistoryForUser()
    .then((orderHistory) => {
      renderOrderHistory(orderHistory);
    })
    .catch((error) => {
      console.error("Error fetching order history:", error);
    });
});
}
else{
  window.location.href = "src/login/login.html";
}


