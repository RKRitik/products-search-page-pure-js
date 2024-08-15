let timer;
let page = 1;
let total_pages = 1;
const max_product_count = 10;
async function fetchProducts(string = "", page = 1) {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/search?limit=${max_product_count}&skip=${
        (page - 1) * max_product_count
      }&q=${string}`
    );
    const result = await response.json();
    const productUl = document.getElementById("product-list");
    //clear list here
    productUl.replaceChildren([]);
    const products = result.products;
    for (let i = 0; i < products.length; i++) {
      const productEntry = document.createElement("div");
      const titleTexts = products[i].title?.split(" ");
      let listItemHTML = "<li>";
      for (let text of titleTexts) {
        if (string.length && text.includes(string)) {
          listItemHTML += ` <span class='highlight'>${text}</span>`;
        } else {
          listItemHTML += ` <span> ${text}</span>`;
        }
      }
      productEntry.innerHTML = listItemHTML + "</li>";
      productUl.appendChild(productEntry);
    }
    paginationState(result.total, page);
    if (!products.length) {
      productUl.appendChild("<li>No results</li>");
    }
  } catch (e) {
    productUl.replaceChildren([]);
    paginationState(0, 1);
  }
}

function paginationState(total, newPage) {
  //update total pages
  page = newPage;
  total_pages = Math.ceil(total / max_product_count);
  document.getElementById("total-pages").innerText = total_pages;
  //update current page
  document.getElementById("page-number").innerText = newPage;
  //disable/enable next page cta
  document.getElementById("next-cta").disabled = newPage === total_pages;
  //disable/enable prev page cta
  document.getElementById("prev-cta").disabled = newPage === 1;
}

function handleSearch(e) {
  const text = e.target.value;
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    fetchProducts(text);
  }, 1000);
}

function navigate(action) {
  if (action === "next") {
    fetchProducts(document.getElementById("search-input").value, page + 1);
  } else {
    fetchProducts(document.getElementById("search-input").value, page - 1);
  }
}

fetchProducts();
