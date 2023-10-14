// Inicializa el spinner
function showSpinner() {
  document.getElementById("spinner").classList.remove("d-none");
  setTimeout(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-hidden");
    if (document.getElementById("pagination") != null) {
      document.getElementById("pagination").classList.remove("d-none");
      document.getElementById("pagination").classList.add("d-block");
      document.getElementById("navbar-top").classList.remove("d-none");
      document.getElementById("navbar-top").classList.add("d-block");
      document.getElementById("spinner").classList.add("d-none");
    } else {
      document.getElementById("navbar-top").classList.remove("d-none");
      document.getElementById("navbar-top").classList.add("d-block");
      document.getElementById("spinner").classList.add("d-none");
    }
  }, 1500);
}

showSpinner();
