
/* =====================================
   HYPNOTIC BEDS
   QUOTE AND ORDER FORM VALIDATION
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const forms = document.querySelectorAll(
        ".quote-form, .order-form"
    );

    forms.forEach(function (form) {

        // Use our custom validation messages
        form.noValidate = true;

        // Display an error message below a field
        function showError(field, message) {
            let error = field.parentElement.querySelector(".field-error");

            if (!error) {
                error = document.createElement("small");
                error.className = "field-error";
                field.insertAdjacentElement("afterend", error);
            }

            error.textContent = message;
            field.classList.add("invalid");
            field.setAttribute("aria-invalid", "true");
        }
        // Remove the error message when corrected
        function clearError(field) {
            const error = field.parentElement.querySelector(".field-error");

            if (error) {
                error.remove();
            }

            field.classList.remove("invalid");
            field.removeAttribute("aria-invalid");
        }

        // Validate an individual field
        function validateField(field) {
            const value = field.value.trim();
            const name = field.name;

            clearError(field);

            // Skip file uploads
            if (field.type === "file") {
                return true;
            }

            // Check required fields
            if (field.required && value === "") {
                showError(
                    field,
                    "This field is required. Please enter or select a value."
                );
                return false;
            }

            // Skip further checks for optional empty fields
            if (value === "") {
                return true;
            }

            // Validate name
            if (name === "name" && value.length < 2) {
                showError(
                    field,
                    "Please enter a name with at least 2 characters."
                );
                return false;
            }

            // Validate phone number
            if (name === "phone") {
                const digits = value.replace(/\D/g, "");
                const phoneFormat = /^\+?[\d\s()-]+$/;

                if (
                    !phoneFormat.test(value) ||
                    digits.length < 9 ||
                    digits.length > 15
                ) {
                    showError(
                        field,
                        "Enter a valid phone number with 9–15 digits."
                    );
                    return false;
                }
            }

            // Validate Gmail address when supplied
            if (name === "email") {
                if (!value.includes("@")) {
                    showError(
                        field,
                        "Your email must include an @ symbol."
                    );
                    return false;
                }

                if (!value.toLowerCase().endsWith("@gmail.com")) {
                    showError(
                        field,
                        "Your email must end with @gmail.com."
                    );
                    return false;
                }

                const emailFormat =
                    /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

                if (!emailFormat.test(value)) {
                    showError(
                        field,
                        "Enter a valid Gmail address, e.g. name@gmail.com."
                    );
                    return false;
                }
            }

            // Validate quantity
            if (name === "quantity") {
                const quantity = Number(value);

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    quantity > 100
                ) {
                    showError(
                        field,
                        "Quantity must be a whole number between 1 and 100."
                    );
                    return false;
                }
            }

            // Validate delivery address on the order form
            if (
                form.classList.contains("order-form") &&
                name === "address" &&
                value.length < 5
            ) {
                showError(
                    field,
                    "Please enter a complete delivery address."
                );
                return false;
            }

            // Check remaining HTML validation rules
            if (!field.validity.valid) {
                if (field.validity.typeMismatch && name === "email") {
                    showError(
                        field,
                        "Please enter a valid email address."
                    );
                } else if (field.validity.rangeUnderflow) {
                    showError(
                        field,
                        "The value is below the allowed minimum."
                    );
                } else if (field.validity.rangeOverflow) {
                    showError(
                        field,
                        "The value is above the allowed maximum."
                    );
                } else if (field.validity.stepMismatch) {
                    showError(
                        field,
                        "Please enter a valid number."
                    );
                } else if (field.validity.patternMismatch) {
                    showError(
                        field,
                        "Please enter a value in the required format."
                    );
                } else {
                    showError(
                        field,
                        "Please check this field."
                    );
                }

                return false;
            }

            return true;
        }

        // Select the fields to validate
        const fields = form.querySelectorAll(
            "input:not([type='file']), select, textarea"
        );

        // Validate fields while typing or changing selections
        fields.forEach(function (field) {

            field.addEventListener("input", function () {
                validateField(field);
            });

            field.addEventListener("change", function () {
                validateField(field);
            });

            field.addEventListener("blur", function () {
                if (field.value.trim() !== "" || field.required) {
                    validateField(field);
                }
            });
        });

        // Hide the previous success message when the form is edited
        form.addEventListener("input", function () {
            const successMessage =
                form.querySelector(".success-message");

            if (successMessage) {
                successMessage.hidden = true;
            }
        });

        form.addEventListener("change", function () {
            const successMessage =
                form.querySelector(".success-message");

            if (successMessage) {
                successMessage.hidden = true;
            }
        });

        // Validate before displaying success
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let isValid = true;
            let firstInvalidField = null;

            fields.forEach(function (field) {
                if (!validateField(field)) {
                    isValid = false;

                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }

                    // Clear the incorrect field
                    field.value = "";
                }
            });

            // Stop if any field is incorrect
            if (!isValid) {
                if (firstInvalidField) {
                    firstInvalidField.focus();

                    firstInvalidField.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                return;
            }

            // Determine which form was completed
            const isQuote = form.classList.contains("quote-form");

            // Create or reuse the success message
            let successMessage =
                form.querySelector(".success-message");

            if (!successMessage) {
                successMessage = document.createElement("p");
                successMessage.className = "success-message";
                successMessage.setAttribute("role", "status");
                successMessage.setAttribute("aria-live", "polite");

                form.appendChild(successMessage);
            }

            // Display the appropriate message
            successMessage.textContent = isQuote
                ? "Your quotation request has been completed successfully! Thank you for contacting Hypnotic Beds."
                : "Your order form has been completed successfully! Thank you for ordering from Hypnotic Beds.";

            successMessage.hidden = false;

            // Clear the form after successful validation
            form.reset();

            // Scroll to the success message
            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });

    });
    });