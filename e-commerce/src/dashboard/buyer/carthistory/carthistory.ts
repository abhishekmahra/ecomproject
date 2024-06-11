let purchaseUserData = localStorage.getItem("activeBuyerUser");
let purchaseUserInfo = JSON.parse(purchaseUserData);
const purchaseUserId = purchaseUserInfo.AciveUserId;
console.log("buyer in purchase",purchaseUserId);

let arrPurchaseItem: any[] = [];
fetch(`http://localhost:3000/purchase/?buyerId=${purchaseUserId}`)
  .then((response) => response.json())
  .then((products) => (arrPurchaseItem = products))
  .then(() => {
      console.log(arrPurchaseItem)
    let list = document.getElementById("purchase_list") ;
    for (let i = 0; i < arrPurchaseItem.length; ++i) {
      let box = document.createElement("box");
      box.style.border = "2px solid black";
      box.style.maxWidth = "fit-content";
      box.innerHTML = `
            <p class="user_name">Product Name: ${arrPurchaseItem[i].buyerProduct}</p>
            <p> Brand: ${arrPurchaseItem[i].brand}</p>
            <p> Price: ${arrPurchaseItem[i].price}</p>`;
      list!.appendChild(box);
    }
  });