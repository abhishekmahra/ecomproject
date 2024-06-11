# E-commerce-Team-3

This project is an e-commerce dashboard for managing products and shopping carts. It allows sellers to add, update, and delete products, while buyers can browse products, add them to their carts, and proceed to checkout.

## Prerequisites
   - Node v20.12.0
   - Typescript v5.2.2
   - Vite 10.5.0
   - Json-server 1.0.0-alpha.23

## Features

- **Seller Dashboard:**

  - Add new products with details like name, stock quantity, price, and description.
  - View existing products and make updates or deletions as needed.

- **Buyer Dashboard:**
  - Browse through available products.
  - Add products to the cart with specified quantities.
  - View the cart contents and proceed to checkout.

## Technologies Used

- **Frontend:**
  - HTML, CSS, TypeScript for the user interface.
  - API for communication with the backend.
- **Backend:**
  - JSON Server for simulating a RESTful API.

## Installation

1. Install dependencies :
   ```
   npm install
   ```

## Usage

1. Use nvm to set your node version :
   ```
   nvm use
   ```

2. Start the JSON Server to simulate the backend :

   ```
    npx json-server db.json --port 8000
   ```

3. Open the application in your browser :

   ```
   npm run dev
   ```

3. Use the seller dashboard to add, update, or delete products.
4. Use the buyer dashboard to browse products, add them to the cart, and proceed to checkout.

