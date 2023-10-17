// Esta función que cambiar la imagen principal del producto
function changeImage(element) {
  var main_prodcut_image = document.getElementById("main_product_image");
  main_prodcut_image.src = element.src;
}

//Inicializar spinner
function toggleDetailsProducts() {
  document.getElementById("product-details").classList.toggle("d-none");
  document.getElementById("pagination").classList.toggle("d-none");
  document.getElementById("navbar-top").classList.toggle("d-none");
}

const showDetailedInfo = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const { message, product } = data;
    const productDetails = document.getElementById("product-details");
    console.log(product);
    const productDetailsHtml = `
    <figure class="card-product-details  card-product-grid card-lg">
    ${product.thumbnail
      .map((img) => {
        return ` 
    <a href="#" class="img-wrap" data-abc="true"> 
    <img src="${img.img1}"> 
     </a>
    `;
      })
      .join("")}
        <figcaption class="info-wrap">
            <div class="row">
                <div class="col-md-9 col-xs-9"> 
                <a href="#" class="title" data-abc="true">
                ${product.title}</a> 
                <span class="rated">${product.category}</span> 
                </div>
                <div class="col-md-3 col-xs-3">
                    <div class="rating text-right"> 
                    <i class="fa fa-star"></i> 
                    <i class="fa fa-star"></i> 
                    <i class="fa fa-star"></i> 
                    <i class="fa fa-star"></i> 
                  </div>
                </div>
            </div>
        </figcaption>
        <div class="bottom-wrap-payment">
            <figcaption class="info-wrap">
                <div class="row">
                    <div class="col-md-9 col-xs-9"> <a href="#" class="title" data-abc="true">$3,999</a> <span class="rated">VISA Platinum</span> </div>
                    <div class="col-md-3 col-xs-3">
                        <div class="rating text-right"> #### 8787 </div>
                    </div>
                </div>
            </figcaption>
        </div>
        <div class="bottom-wrap d-flex justify-content-between "> <a href="#" class="btn-product-details  btn-primary float-right" data-abc="true"> Buy now </a>
            <div class="price-wrap"> <a href="#" class="btn-product-details  btn-warning float-left" data-abc="true"> Cancel </a> </div>
        </div>
    </figure>
    `;

    productDetails.innerHTML = productDetailsHtml;
    toggleDetailsProducts();
  } catch (error) {
    console.error(error);
  }
};
