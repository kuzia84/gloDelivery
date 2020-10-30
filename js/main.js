"use ctrict";

const cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector(".button-auth"),
  buttonCart = document.querySelector("#button-cart"),
  buttonOut = document.querySelector(".button-out"),
  userName = document.querySelector(".user-name"),
  modalAauth = document.querySelector(".modal-auth"),
  closeAuth = document.querySelector(".close-auth"),
  logInForm = document.querySelector("#logInForm"),
  loginInput = document.querySelector("#login"),
  cardsRestaurants = document.querySelector(".cards-restaurants"),
  containerPromo = document.querySelector(".container-promo"),
  restaurants = document.querySelector(".restaurants"),
  menu = document.querySelector(".menu"),
  logo = document.querySelector(".logo"),
  cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("gloDelivery");

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Обибка по адресу ${url}, статус ошибка ${response.status}!`
    );
  }

  return await response.json();
};

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAauth.classList.toggle("is-open");
  loginInput.style.borderColor = "";
  if (modalAauth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem("gloDelivery");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }

  console.log("Авторизован");

  userName.textContent = login;
  localStorage.setItem("gloDelivery", login);

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();

    if (validName(loginInput.value)) {
      login = loginInput.value;
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "red";
      alert("Введите логин");
      return;
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
  modalAauth.addEventListener("click", (e) => {
    if (e.target.classList.contains("is-open")) {
      toggleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardsRestaurants({
  image,
  kitchen,
  name,
  price,
  products,
  stars,
  time_of_delivery: timeOfDelivery,
}) {
  const card = `
  <a class="card card-restaurant" data-products="${products}" data-info="${name}, ${stars}, ${price}, ${kitchen}">
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;
  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function creteCardGood({ description, id, image, name, price }) {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML(
    "beforeend",
    `
      <img src="${image}" alt="${name}" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
    `
  );
  cardsMenu.insertAdjacentElement("beforeend", card);
}

function createRestaurantHeader(info) {
  const infoArr = info.split(",");
  const cardsRestaurantHeader = menu.querySelector(".section-heading");
  cardsRestaurantHeader.innerHTML = "";
  cardsRestaurantHeader.insertAdjacentHTML(
    "afterbegin",
    `
      <h2 class="section-title restaurant-title">${infoArr[0]}</h2>
        <div class="card-info">
          <div class="rating">
          ${infoArr[1]}
          </div>
          <div class="price">От ${infoArr[2]} ₽</div>
          <div class="category">${infoArr[3]}</div>
        </div>
    `
  );
}

function openGoods(event) {
  const target = event.target,
    restaurant = target.closest(".card-restaurant");
  if (restaurant) {
    if (login) {
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      cardsMenu.textContent = "";
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(creteCardGood);
      });
      createRestaurantHeader(restaurant.dataset.info);
    } else {
      toggleModalAuth();
    }
  }
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardsRestaurants);
  });

  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener("click", openGoods);
  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  checkAuth();

  /* Slider */

  new Swiper(".swiper-container", {
    sliderPerView: 1,
    loop: true,
    grabCursor: true,
  });
}

init();
