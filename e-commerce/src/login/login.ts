import * as bcrypt from "bcrypt-ts";
import { hashSync } from "bcrypt-ts";

let handleSignIn = document.getElementById("btn");
handleSignIn?.addEventListener("click", (e) => {
  e.preventDefault();
  const emailInput = (
    document.getElementById("emailAuthenticate") as HTMLInputElement
  ).value;
  const passwordInput = (
    document.getElementById("passwordAuthenticate") as HTMLInputElement
  ).value;
  
  if (!emailInput || !passwordInput) {
    (document.getElementById("authenticationError") as HTMLElement).innerText =
      "Enter email and password!!!";
  } else {
    (document.getElementById("authenticationError") as HTMLElement).innerText =
      "";
    let url = "http://localhost:8000/users";
    url += "?email=" + emailInput;
    fetch(url)
      .then((result) => result.json())
      .then((users) => {
        if (users.length === 0) {
          alert("User not found");
        } else {
          const user = users[0]; // Assuming email is unique
          console.log("user found" + user.password);
          if (comparePasswords(passwordInput, user.password)) {
            // Authentication successful
            localStorage.setItem("activeUser", JSON.stringify(user));

            alert("login successfull")
            if (user.userType === "Seller") {
              window.location.href = "../dashboard/seller/seller.html";
            } else {
              window.location.href = "../dashboard/buyer/buyer.html";
            }
          } else {
            (document.getElementById(
              "authenticationError"
            ) as HTMLElement).innerText = "Invalid email or password!!!";
          }
        }
      });
  }
});

function comparePasswords(inputPassword: string, hashedPassword: string) {
  return hashSync(inputPassword, hashedPassword) === hashedPassword;
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(5);
  return bcrypt.hashSync(password, salt);
}