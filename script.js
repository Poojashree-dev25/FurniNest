const products = [...document.querySelectorAll(".product-card")];
const cart = [];
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartSubtotal.textContent = money(subtotal);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <img src="${item.image}" alt="">
      <div><h4>${item.name}</h4><p>${money(item.price)} · Qty ${item.qty}</p><button data-remove="${index}">Remove</button></div>
      <strong>${money(item.price * item.qty)}</strong>
    </div>`).join("");
}

document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const name = card.dataset.name;
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({
      name,
      price: Number(card.dataset.price),
      image: card.querySelector("img").src,
      qty: 1
    });
    updateCart();
    showToast(`${name} added to your bag`);
  });
});

cartItems.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.remove), 1);
  updateCart();
});

const cartDrawer = document.getElementById("cartDrawer");
function openCart() {
  document.body.classList.add("cart-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  document.body.classList.remove("cart-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  showToast("Demo store: checkout is not connected yet.");
});

document.querySelectorAll(".filter-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".filter-tab.active")?.classList.remove("active");
    tab.classList.add("active");
    const filter = tab.dataset.filter;
    products.forEach(card => {
      card.hidden = filter !== "All" && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll(".collection-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    document.querySelectorAll(".filter-tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.filter === category);
    });
    products.forEach(product => product.hidden = product.dataset.category !== category);
  });
});

document.querySelectorAll(".heart-button").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");
    button.textContent = button.classList.contains("liked") ? "♥" : "♡";
    showToast(button.classList.contains("liked") ? "Added to your wishlist" : "Removed from wishlist");
  });
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
document.getElementById("searchButton").addEventListener("click", () => {
  searchPanel.classList.add("open");
  setTimeout(() => searchInput.focus(), 250);
});
document.getElementById("closeSearch").addEventListener("click", () => searchPanel.classList.remove("open"));
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  products.forEach(card => {
    card.hidden = query.length > 0 && !card.dataset.name.toLowerCase().includes(query);
  });
  document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.filter === "All"));
});

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("emailInput");
  document.getElementById("newsletterMessage").textContent = `Thanks for joining us, ${email.value}! (Demo form)`;
  email.value = "";
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".section-heading, .collection-card, .product-card, .feature-copy, .quote-section, .newsletter").forEach(element => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

// Subtle pointer parallax on the hero image, disabled for touch-sized screens.
const heroArt = document.getElementById("heroArt");
if (window.matchMedia("(min-width: 900px)").matches) {
  heroArt.addEventListener("mousemove", event => {
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const image = heroArt.querySelector(".hero-image-wrap");
    image.style.transform = `rotateY(${-7 + x * 7}deg) rotateX(${2 - y * 5}deg) translateY(${y * -5}px)`;
  });
  heroArt.addEventListener("mouseleave", () => {
    heroArt.querySelector(".hero-image-wrap").style.transform = "";
  });
}

updateCart();
