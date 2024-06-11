export interface user {
  // id: string;
  fullName: string;
  email: string;
  phone: number;
  password: string;
  gender: string;
  // userType: "buyer" | "seller";
  userType: string;
}

export interface product {
  id: string;
  sellerID: string;
  productName: string;
  description: string;
  quantity: number; // number of items user want to purchase
  stock: number; // number of items user can purchase
  price: number;
}

export interface cart {
  buyerId: string;
  productId: string;
  quantity: number;
}
