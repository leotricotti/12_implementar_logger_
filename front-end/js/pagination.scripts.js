const updatePagination = () => {
  const currentPage = parseInt(localStorage.getItem("currentPage"));
  const previousButton = document.getElementById("previous-page");
  const nextButton = document.getElementById("next-page");

  if (currentPage === 1) {
    previousButton.classList.add("disabled");
    previousButton.disabled = true;
  } else {
    previousButton.classList.remove("disabled");
    previousButton.disabled = false;
  }

  if (currentPage === 4) {
    nextButton.classList.add("disabled");
    nextButton.disabled = true;
  } else {
    nextButton.classList.remove("disabled");
    nextButton.disabled = false;
  }
};

const previousPage = () => {
  let currentPage = localStorage.getItem("currentPage");
  currentPage = parseInt(currentPage);
  if (currentPage > 1) {
    currentPage -= 1;
    productsHandler("page", currentPage);
    localStorage.setItem("currentPage", currentPage);
    setActivePage(currentPage);
  }
  updatePagination();
  activePage();
};

const nextPage = () => {
  let currentPage = localStorage.getItem("currentPage");
  currentPage = parseInt(currentPage);
  if (currentPage < 4) {
    currentPage += 1;
    productsHandler("page", currentPage);
    localStorage.setItem("currentPage", currentPage);
    setActivePage(currentPage);
  }
  updatePagination();
  activePage();
};

document.addEventListener("DOMContentLoaded", () => {
  updatePagination();
});

const setActivePage = (page) => {
  const elements = document.querySelectorAll(`li[data-page]`);
  elements.forEach((element) => {
    if (element.dataset.page === page) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
  localStorage.setItem("currentPage", page);
  productsHandler("page", page);
  updatePagination();
};

const activePage = () => {
  const currentPage = localStorage.getItem("currentPage");
  setActivePage(currentPage);
};

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = localStorage.getItem("currentPage");
  if (!currentPage) {
    setActivePage("1");
  } else {
    setActivePage(currentPage);
  }
  const elements = document.querySelectorAll(`li[data-page]`);
  elements.forEach((element) => {
    element.addEventListener("click", () => {
      setActivePage(element.dataset.page);
    });
  });
});
