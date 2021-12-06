(function () {
    var productNameField = document.getElementById("productName");

    var forms = document.querySelectorAll(".needs-validation");

    var productNameField = document.getElementById("productName");
    var productDescriptionField = document.getElementById("productDescription");
    var productUrl = document.getElementById("productUrl");
    var productTag = document.getElementById("productTag");
    var photo = document.getElementById("productLogo");
    productNameField.addEventListener("input", function () {
        var val = document.getElementById("productName").value;
        if (!val || val.length < 2) {
            productNameField.setCustomValidity("invalid");
        } else {
            productNameField.setCustomValidity("");
        }
    });

    productDescriptionField.addEventListener("input", function () {
        var val = document.getElementById("productDescription").value;
        if (!val || val.length < 2) {
            productDescriptionField.setCustomValidity("invalid");
        } else {
            productDescriptionField.setCustomValidity("");
        }
    });

    productUrl.addEventListener("input", function () {
        var val = document.getElementById("productUrl").value;
        if (!val || val.length < 2) {
            productUrl.setCustomValidity("invalid");
        } else {
            productUrl.setCustomValidity("");
        }
    });

    productUrl.addEventListener("input", function () {
        var val = document.getElementById("productUrl").value;
        if (!val || val.length < 2) {
            productUrl.setCustomValidity("invalid");
        } else {
            productUrl.setCustomValidity("");
        }
    });

    productTag.addEventListener("input", function () {
        var val = document.getElementById("productTag").value;
        if (!val || val.length < 2) {
            productTag.setCustomValidity("invalid");
        } else {
            productTag.setCustomValidity("");
        }
    });

    photo.addEventListener("input", function () {
        var val = document.getElementById("productLogo").value;
        console.log("val", val);
        const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
        const fileType = this.files[0].type;
        if (
            !fileType ||
            !validImageTypes.includes(fileType) ||
            this.files[0].size / 1024 / 1024 > 2
        ) {
            photo.setCustomValidity("invalid");
        } else {
            photo.setCustomValidity("");
        }
    });

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
            "submit",
            function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false
        );
    });

    const $ratingElements = $("[data-productid]");
    for (let i = 0; i < $ratingElements.length; i++) {
        const ratingId = $ratingElements[i].dataset.productid;
        const rating = Math.floor(
            $(`[data-productid=${ratingId}]`).attr("data-rating")
        );
        console.log("ratingId :>> ", ratingId);
        if (rating == 0) {
            $(`[data-productid=${ratingId}]`).append(
                `<span class="fa fa fa-star-o uncheckedStar" ></span> <span class="fa fa fa-star-o uncheckedStar" ></span> <span class="fa fa fa-star-o uncheckedStar" ></span> <span class="fa fa fa-star-o uncheckedStar" ></span> <span class="fa fa fa-star-o uncheckedStar" ></span>`
            );
        } else {
            console.log(`rating`, rating);
            for (i = rating; i > 0; i--) {
                $(`[data-productid=${ratingId}]`).append(
                    `<span class="fa fa-star"></span>`
                );
            }
            for (i = 5 - rating; i > 0; i--) {
                $(`[data-productid=${ratingId}]`).append(
                    `<span class="fa fa-star-o uncheckedStar" ></span>`
                );
            }
        }
    }

    function isValidString(val) {
        console.log("here");
        if (typeof val !== "string" || val.trim().length < 2) {
            return false;
        } else {
            return true;
        }
    }

    function isValidwebsiteUrl(websiteUrl) {
        let midString = websiteUrl.substring(
            websiteUrl.indexOf(".") + 1,
            websiteUrl.lastIndexOf(".")
        );
        if (typeof websiteUrl !== "string" || websiteUrl.trim().length < 1) {
            return false;
        } else if (
            websiteUrl.startsWith("http://www.") &&
            websiteUrl.endsWith(".com")
        ) {
            return false;
        } else if (midString.length < 5) {
            return false;
        } else {
            return true;
        }
    }
})();
