// All Inputs
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById("productCategory");
var productDescription = document.getElementById("productDescription");
var productImage = document.getElementById("productImage");
var searchInput = document.getElementById("searchInput");
// These buttons toggle between Add Mode and Update Mode
var addButton = document.getElementById("addButton");
var updateButton = document.getElementById("updateButton");
var updateIndex; // this is a global variable used to pass productIndex from updateProduct function to confirmUpdate function

// allProductsList is the main list, searchedProducts is used during search
var allProductsList;
var searchedProducts;

var displayingArea = document.getElementById("displaying-area");

// On page load
if (!localStorage.getItem("allProductsList")) {
  allProductsList = [];
} else {
  allProductsList = JSON.parse(localStorage.getItem("allProductsList"));
  displayProducts(allProductsList);
}

function validateInputs(thisInput = productName) {
  var regex;
  switch (thisInput) {
    case productName:
      thisInput.value = thisInput.value
        .trim()
        .replace(/\s+/g, " ")
        .replace(/_+/g, " ");

      regex = /^[A-Z][\w ]{2,15}$/i;

      break;

    case productPrice:
      regex = /^[1-9][0-9]{1,5}$/i;
      break;

    case productCategory:
      thisInput.value = thisInput.value.trim();

      regex = /^(Laptop|Mobile|Accessories|TV)$/i;
      break;

    case productDescription:
      thisInput.value = thisInput.value
        .trim()
        .replace(/\s+/g, " ")
        .replace(/_+/g, " ");

      regex = /^[\w \.]{3,100}$/;
      break;
  }

  if (regex.test(thisInput.value)) {
    thisInput.classList.add("is-valid");
    thisInput.classList.remove("is-invalid");
    thisInput.nextElementSibling.classList.add("d-none");
  } else {
    thisInput.nextElementSibling.classList.remove("d-none");
    thisInput.classList.add("is-invalid");
    thisInput.classList.remove("is-valid");
  }
}

// On Add button click
function addProduct() {
  var product = {
    productName: productName.value,
    productPrice: productPrice.value,
    productCategory: productCategory.value,
    productDescription: productDescription.value,
    productImage: `imgs/${productImage.files[0]?.name || "placeholder.webp"}`,
  };

  allProductsList.push(product);

  localStorage.setItem("allProductsList", JSON.stringify(allProductsList));
  clearInputs();
  displayProducts(allProductsList);
}

function validateAddProduct() {
  if (
    productName.classList.contains("is-valid") &&
    productPrice.classList.contains("is-valid") &&
    productCategory.classList.contains("is-valid") &&
    productDescription.classList.contains("is-valid")
  ) {
    addProduct();
    return;
  }

  if (!productName.classList.contains("is-valid")) {
    productName.nextElementSibling.classList.remove("d-none");
  }

  if (!productPrice.classList.contains("is-valid")) {
    productPrice.nextElementSibling.classList.remove("d-none");
  }

  if (!productCategory.classList.contains("is-valid")) {
    productCategory.nextElementSibling.classList.remove("d-none");
  }

  if (!productDescription.classList.contains("is-valid")) {
    productDescription.nextElementSibling.classList.remove("d-none");
  }
}

function clearInputs() {
  productName.value = null;
  productPrice.value = null;
  productCategory.value = null;
  productDescription.value = null;
  productImage.value = null;
  searchInput.value = null;

  productName.classList.remove("is-valid");
  productPrice.classList.remove("is-valid");
  productCategory.classList.remove("is-valid");
  productDescription.classList.remove("is-valid");
}

function displayProducts(list) {
  var allProductsString = "";

  for (var i = 0; i < list.length; i++) {
    allProductsString += `<div class="col-md-4 my-3">
          <div class="item">
            <img src="${list[i].productImage}" alt="Product Image" class="w-100" >
            <h3>Name: ${list[i].productName}</h3>
            <p>Price: ${list[i].productPrice}$</p>
            <p>Category: ${list[i].productCategory} </p>
            <p>Description: ${list[i].productDescription}</p>
            <button
              onclick="deleteProduct(${i})"
              class="btn btn-outline-danger w-100 py-2 my-1"
              type="button"
            >
              Delete Product <i aria-hidden="true" class="fas fa-trash-can"> </i>
            </button>
            <button
              onclick="updateProduct(${i})"
              class="btn btn-outline-warning w-100 py-2 my-1"
              type="button"
            >
              Update Product <i aria-hidden="true" class="fas fa-pen"> </i>
            </button>
          </div>
        </div>`;
  }

  if (!allProductsString) {
    allProductsString = `<h3 class = "bg-danger text-dark text-center rounded-2">Not Found !</h3>`;
  }

  displayingArea.innerHTML = allProductsString;
}

// Search
function searchProduct() {
  var searchValue = searchInput.value;
  searchedProducts = [];

  for (var i = 0; i < allProductsList.length; i++) {
    if (
      allProductsList[i].productName
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    ) {
      searchedProducts.push(allProductsList[i]);
    }
  }

  displayProducts(searchedProducts);
}

// On Delete button click
function deleteProduct(productIndex) {
  var deleteIndex;
  if (searchInput.value) {
    var selectedProduct = searchedProducts[productIndex];
    deleteIndex = allProductsList.indexOf(selectedProduct);
  } else {
    deleteIndex = productIndex;
  }

  allProductsList.splice(deleteIndex, 1);

  localStorage.setItem("allProductsList", JSON.stringify(allProductsList));
  displayProducts(allProductsList);
}

// Update
function updateProduct(productIndex) {
  var updatedProduct;
  if (searchInput.value) {
    var selectedProduct = searchedProducts[productIndex];
    updateIndex = allProductsList.indexOf(selectedProduct);
  } else {
    updateIndex = productIndex;
  }

  updatedProduct = allProductsList[updateIndex];

  productName.value = updatedProduct.productName;
  productPrice.value = updatedProduct.productPrice;
  productCategory.value = updatedProduct.productCategory;
  productDescription.value = updatedProduct.productDescription;

  addButton.classList.add("d-none");
  updateButton.classList.remove("d-none");
}

function confirmUpdate() {
  var updatedProduct = allProductsList[updateIndex];

  updatedProduct.productName = productName.value;
  updatedProduct.productPrice = productPrice.value;
  updatedProduct.productCategory = productCategory.value;
  updatedProduct.productDescription = productDescription.value;

  addButton.classList.remove("d-none");
  updateButton.classList.add("d-none");

  displayProducts(allProductsList);
  localStorage.setItem("allProductsList", JSON.stringify(allProductsList));
  clearInputs();
}

function validateConfirmUpdate() {
  if (
    !(
      productName.classList.contains("is-invalid") ||
      productPrice.classList.contains("is-invalid") ||
      productCategory.classList.contains("is-invalid") ||
      productDescription.classList.contains("is-invalid")
    )
  ) {
    confirmUpdate();
  }
}
