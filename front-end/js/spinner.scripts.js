//Inicializar spinner
function showSpinner() {
  document.getElementById("spinner").classList.remove("d-none");
  Promise.all([
    new Promise((resolve) => {
      window.addEventListener("load", resolve);
    }),
    new Promise((resolve) => {
      setTimeout(resolve, 5000);
    }),
  ]).then(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-hidden");
    if (document.getElementById("pagination") != null) {
      document.getElementById("pagination").classList.remove("d-none");
      document.getElementById("pagination").classList.add("d-block");
    }
    document.getElementById("navbar-top").classList.remove("d-none");
    document.getElementById("navbar-top").classList.add("d-block");
    document.getElementById("spinner").classList.add("d-none");
  });
}

showSpinner();
