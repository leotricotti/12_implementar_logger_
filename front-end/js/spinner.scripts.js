// Inicializa el spinner
function showSpinner() {
  setTimeout(() => {
    document.getElementById("spinner").classList.remove("d-none");
    document.getElementById("spinner").classList.add("d-block");
  }, 3000);
}
