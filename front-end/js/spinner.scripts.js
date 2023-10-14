// Inicializa el spinner
function showSpinner() {
  document.getElementById("spinner").classList.remove("d-none");
  setTimeout(() => {
    document.getElementById("navbar-top").classList.remove("d-none");
    document.getElementById("navbar-top").classList.add("d-block");
    document.getElementById("spinner").classList.add("d-none");
  }, 1500);
}

showSpinner();
