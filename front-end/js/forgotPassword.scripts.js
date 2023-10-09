//Funcion que envia los datos al backend
async function postForgot(username, newPassword) {
  const response = await fetch("http://localhost:8080/api/sessions/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ username, newPassword }),
  });

  const result = await response.json();
  return result;
}

//Capturamos el formulario de login
const loginForm = document.getElementById("login-form");

//Funcion que captura los datos y actualiza la contraseña
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const newPassword = document.getElementById("new-password").value;

  if (password !== newPassword) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Las contraseñas no coinciden. Por favor, inténtelo de nuevo",
      showConfirmButton: false,
      timer: 1800,
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
    });
  } else {
    postForgot(username, newPassword)
      .then(() =>
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada con éxito",
          showConfirmButton: false,
          timer: 1800,
          showClass: {
            popup: "animate__animated animate__zoomIn",
          },
        }).then(() => {
          window.location.href = "../html/index.html";
        })
      )
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ha ocurrido un error. Por favor, inténtelo de nuevo",
          showConfirmButton: false,
          timer: 1800,
          showClass: {
            popup: "animate__animated animate__zoomIn",
          },
        })
      );
  }
});

// Codigo que captura el boton de mostrar/ocultar contraseña
const newEyeOpen = document.getElementById("new-eye-open");
const newPassword = document.getElementById("new-password");
const newEyeClose = document.getElementById("new-eye-close");
const newEyeContainer = document.getElementById("new-eye-container");

// Codigo que agrega un evento de click al boton de mostrar/ocultar contraseña
newEyeContainer.addEventListener("click", () => {
  newEyeOpen.classList.toggle("show-password");
  newEyeClose.classList.toggle("show-password");
  showNewPassword();
});

// Funcion que muestra/oculta la contraseña
const showNewPassword = () => {
  if (newEyeOpen.classList.contains("show-password")) {
    newPassword.type = "text";
  } else {
    newPassword.type = "password";
  }
};
