import { genSaltSync, hashSync } from "bcrypt-ts";
import { user } from "../../interfaces";

function encryptPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
}

function handleLoginPath() {
  location.href = "/src/login/login.html";
}

const isMaxUsersReached = (): boolean => {
  const storedFormData = JSON.parse(localStorage.getItem("records") || "[]");
  return storedFormData.length >= 20;
};

function formData(event: Event) {
  event.preventDefault();

  // Full Name
  const fullNameInput = document.getElementById("fullName") as HTMLInputElement;
  const fullName = fullNameInput.value;
  const fullNameError = document.getElementById("fullNameError") as HTMLElement;
  nameValidation(fullName, fullNameError);

  // Email
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const email = emailInput.value;
  const emailError = document.getElementById("emailError") as HTMLElement;
  emailValidation(email, emailError);
  // Phone Number
  const phoneInput = document.getElementById("phone") as HTMLInputElement;
  const phone = phoneInput.value;
  const phoneError = document.getElementById("phoneError") as HTMLElement;
  phoneValidation(phone, phoneError);
  // Date of Birth
  const dateOfBirthInput = document.getElementById("date") as HTMLInputElement;
  const dateOfBirth = dateOfBirthInput.value;
  const dateError = document.getElementById("dateError") as HTMLElement;
  dobValidation(dateOfBirth, dateError);
  // Password
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const password = passwordInput.value;
  const passwordError = document.getElementById("passwordError") as HTMLElement;

  passwordValidation(password, passwordError);

  // Confirm Password
  const confirmPasswordInput = document.getElementById(
    "password2"
  ) as HTMLInputElement;
  const confirmPassword = confirmPasswordInput.value;
  const confirmPasswordError = document.getElementById(
    "confirmPasswordError"
  ) as HTMLElement;
  confirmPasswordValidation(password, confirmPassword, confirmPasswordError);

  // Gender
  let gender: string = "";
  if ((document.getElementById("male") as HTMLInputElement).checked) {
    gender = (document.getElementById("male") as HTMLInputElement).value;
  } else if ((document.getElementById("female") as HTMLInputElement).checked) {
    gender = (document.getElementById("female") as HTMLInputElement).value;
  } else if ((document.getElementById("other") as HTMLInputElement).checked) {
    gender = (document.getElementById("other") as HTMLInputElement).value;
  }
  const genderError = document.getElementById("gender-error") as HTMLElement;
  radioValidation(gender, genderError, "Gender");

  let userType: string = "";
  if ((document.getElementById("Buyer") as HTMLInputElement).checked) {
    userType = (document.getElementById("Buyer") as HTMLInputElement).value;
  } else if ((document.getElementById("Seller") as HTMLInputElement).checked) {
    userType = (document.getElementById("Seller") as HTMLInputElement).value;
  } else userType = "";

  const userError = document.getElementById("user-error") as HTMLElement;
  // radioValidation(userType, userError, "usertype");
  // required(userType, userError, "usertype");
  // console.log(userType);

  if (userType === "") {
    userError.innerHTML = "Please select either Buyer or Seller.";
  }
  if (
    !fullNameError.innerHTML &&
    !emailError.innerHTML &&
    !phoneError.innerHTML &&
    !dateError.innerHTML &&
    !passwordError.innerHTML &&
    !confirmPasswordError.innerHTML &&
    !genderError.innerHTML &&
    !userError.innerHTML
  ) {
    let url = "http://localhost:8000";
    let tempUrl = url + "/users?email=" + email;
    console.log(tempUrl);

    fetch(tempUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          let user: user = {
            fullName: fullName,
            email: email,
            phone: parseInt(phone),
            password: encryptPassword(password),
            gender: gender,
            userType: userType,
          };

          fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });
          console.log(data);
          alert("Registration Successful!");
          form.reset();
        } else {
          alert("Email already exists");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else console.log("fill data");
}

// Validation functions
const nameValidation = (input: string, errorid: HTMLElement) => {
  required(input, errorid, "Name") ||
    stringValidation(input, errorid) ||
    checkLength(input, errorid, 3, 30) ||
    clear(errorid);
};

const emailValidation = (input: string, errorid: HTMLElement) => {
  required(input, errorid, "Email") ||
    emailFormatValidation(input, errorid) ||
    clear(errorid);
};

const passwordValidation = (input: string, errorid: HTMLElement): void => {
  if (
    required(input, errorid, "Password") ||
    checkLength(input, errorid, 8, 16) ||
    checkPasswordFormat(input, errorid)
  ) {
    return;
  }
  clear(errorid);
};
const phoneValidation = (input: string, errorid: HTMLElement) => {
  required(input, errorid, "Phone number") ||
    checkPhoneFormat(input, errorid) ||
    clear(errorid);
};
const radioValidation = (input: string, errorid: HTMLElement, temp: string) => {
  required(input, errorid, temp) || clear(errorid);
};
const dobValidation = (input: string, errorid: HTMLElement) => {
  required(input, errorid, "Date of birth") ||
    checkAgeRange(input, errorid) ||
    clear(errorid);
};
// Common validation functions
const required = (
  input: string,
  errorid: HTMLElement,
  str: string
): boolean => {
  if (!input || input.trim() === "") {
    errorid.innerHTML = `${str} cannot be empty.`;
    return true;
  }
  return false;
};

const stringValidation = (input: string, errorid: HTMLElement): boolean => {
  let pattern = /^[A-Za-z\s]+$/;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Input should contain only letters and spaces.";
    return true;
  }
  return false;
};
const checkLength = (
  input: string,
  errorid: HTMLElement,
  minlength: number,
  maxlength: number
): boolean => {
  if (input.length < minlength && input.length > 0) {
    errorid.innerHTML = `Input should contain minimum ${minlength} characters.`;
    return true;
  } else if (input.length > maxlength) {
    errorid.innerHTML = `Input should contain maximum ${maxlength} characters.`;
    return true;
  }
  return false;
};

const emailFormatValidation = (
  input: string,
  errorid: HTMLElement
): boolean => {
  let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Please enter a valid email address.";
    return true;
  }
  clear(errorid);
  return false;
};

const checkPasswordFormat = (input: string, errorid: HTMLElement): boolean => {
  return (
    capitalAlphabetCheck(input, errorid) ||
    smallAlphabetCheck(input, errorid) ||
    numberCheck(input, errorid) ||
    specialCharacterCheck(input, errorid)
  );
};

const capitalAlphabetCheck = (input: string, errorid: HTMLElement): boolean => {
  let pattern = /[A-Z]/;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Password must contain at least one capital letter.";
    return true;
  }
  return false;
};

const smallAlphabetCheck = (input: string, errorid: HTMLElement): boolean => {
  let pattern = /[a-z]/g;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Password must contain at least one lowercase letter.";
    return true;
  }
  return false;
};

const numberCheck = (input: string, errorid: HTMLElement): boolean => {
  let pattern = /[0-9]/g;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Password must contain at least one number.";
    return true;
  }
  return false;
};

const specialCharacterCheck = (
  input: string,
  errorid: HTMLElement
): boolean => {
  let pattern = /[!@#$%^&*]/g;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Password must contain at least one special character.";
    return true;
  }
  return false;
};

const confirmPasswordValidation = (
  password: string,
  confirmPassword: string,
  errorid: HTMLElement
): boolean => {
  if (password !== confirmPassword) {
    errorid.innerHTML = "Passwords do not match.";
    return true;
  } else {
    clear(errorid);
    return false;
  }
};

const checkPhoneFormat = (input: string, errorid: HTMLElement): boolean => {
  let pattern = /^[0-9]{10}$/;
  if (!pattern.test(input)) {
    errorid.innerHTML = "Please enter a valid phone number.";
    return true;
  }
  return false;
};

const checkAgeRange = (input: string, errorid: HTMLElement): boolean => {
  const date = new Date(input);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - date.getFullYear();
  if (age < 18) {
    errorid.innerHTML = "You must be at least 18 years old.";
    return true;
  }
  return false;
};

function permissionValidation(
  canEdit: boolean,
  canDelete: boolean,
  errorid: HTMLElement
) {
  if (!canEdit && !canDelete) {
    errorid.innerHTML = "Please select at least one permission.";
    return true;
  }
  clear(errorid);
  return false;
}

// Function to clear error messages
const clear = (errorid: HTMLElement) => {
  errorid.innerHTML = "";
};

const form = document.getElementById("form") as HTMLFormElement;

// Add event listener for form submission
form.addEventListener("submit", formData);

// Functions to add blur event
const fullNameInput = document.getElementById("fullName") as HTMLInputElement;
const fullNameError = document.getElementById("fullNameError") as HTMLElement;
fullNameInput.addEventListener("blur", () =>
  nameValidation(fullNameInput.value, fullNameError)
);

const emailInput = document.getElementById("email") as HTMLInputElement;
const emailError = document.getElementById("emailError") as HTMLElement;
emailInput.addEventListener("blur", () =>
  emailValidation(emailInput.value, emailError)
);

const phoneInput = document.getElementById("phone") as HTMLInputElement;
const phoneError = document.getElementById("phoneError") as HTMLElement;
phoneInput.addEventListener("blur", () =>
  phoneValidation(phoneInput.value, phoneError)
);

const dateOfBirthInput = document.getElementById("date") as HTMLInputElement;
const dateError = document.getElementById("dateError") as HTMLElement;
dateOfBirthInput.addEventListener("blur", () =>
  dobValidation(dateOfBirthInput.value, dateError)
);

const passwordInput = document.getElementById("password") as HTMLInputElement;
const passwordError = document.getElementById("passwordError") as HTMLElement;
passwordInput.addEventListener("blur", () =>
  passwordValidation(passwordInput.value, passwordError)
);

const confirmPasswordInput = document.getElementById(
  "password2"
) as HTMLInputElement;
const confirmPasswordError = document.getElementById(
  "confirmPasswordError"
) as HTMLElement;
confirmPasswordInput.addEventListener("blur", () =>
  confirmPasswordValidation(
    passwordInput.value,
    confirmPasswordInput.value,
    confirmPasswordError
  )
);

const genderError = document.getElementById("gender-error") as HTMLElement;
const genderInputs = document.querySelectorAll('input[name="gender"]');
genderInputs.forEach((input) => {
  input.addEventListener("click", () => {
    radioValidation((input as HTMLInputElement).value, genderError, "Gender");
  });
});

const userTypeError = document.getElementById("user-error") as HTMLElement;
const userTypeInputs = document.querySelectorAll('input[name="userType"]');
userTypeInputs.forEach((input) => {
  input.addEventListener("click", () => {
    radioValidation(
      (input as HTMLInputElement).value,
      userTypeError,
      "userType"
    );
  });
});
