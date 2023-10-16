// Esta función que cambiar la imagen principal del producto
function changeImage(element) {
  var main_prodcut_image = document.getElementById("main_product_image");
  main_prodcut_image.src = element.src;
}

const showDetailedInfo = async (id) => {
  const token = localStorage.getItem("token");

  console.log(id);

  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
