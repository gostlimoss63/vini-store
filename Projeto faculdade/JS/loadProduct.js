import { getProductById, getProductBySlug } from "./data.js";

console.log("loadProduct.js carregado");

(function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const productParam = params.get("product");
  const productName = params.get("name");

  console.log("Parâmetros da URL:", { productId, productParam, productName });

  if (!productId && !productParam) {
    console.warn("Nenhum id/slug na URL");
    return;
  }

  const colorMap = {
    preto: "#000000",
    branco: "#ffffff",
    azul_marinho: "#1b2b4a",
    azul: "#2b5daa",
    cinza: "#808080",
    bege: "#d7c6a3",
    marrom: "#8b6f47",
    vermelho: "#a1261f",
    verde: "#2d5016",
    mostarda: "#c4a747",
    rosa: "#e91e63",
    laranja: "#ff9800",
    roxo: "#9c27b0",
    teal: "#009688",
    ouro: "#ffd700",
    prata: "#c0c0c0",
    coral: "#ff7f50",
    turquesa: "#40e0d0",
    khaki: "#f0e68c",
    oliva: "#808000",
    aquaverde: "#4DE9D9",
    azul_claro: "#ADD8E6",
  };

  function tryLoadImage(src) {
    console.log("Tentando carregar imagem:", src);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        console.log("OK:", src);
        resolve(src);
      };
      img.onerror = (e) => {
        console.warn("ERRO ao carregar:", src, e);
        reject(src);
      };
      img.src = src;
    });
  }

  async function findFirstExisting(candidates) {
    for (const c of candidates) {
      try {
        await tryLoadImage(c);
        return c;
      } catch (_) {
        // continua tentando próximo
      }
    }
    return null;
  }

  function insertMainImage(src) {
    console.log("Inserindo imagem principal:", src);
    const gallery = document.querySelector(".gallery .gallery-images");
    if (!gallery) {
      console.warn("Container .gallery .gallery-images não encontrado");
      return;
    }
    let picture = gallery.querySelector("picture");
    if (!picture) {
      picture = document.createElement("picture");
      gallery.prepend(picture);
    }
    picture.innerHTML = `<img id="product-main-image" src="${src}" alt="" loading="eager">`;
  }

  function createSwatch(imageSrc, colorName, hexColor) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.dataset.color = colorName;
    btn.dataset.imageSrc = imageSrc;
    btn.title = colorName || "";
    btn.style.width = "44px";
    btn.style.height = "44px";
    btn.style.borderRadius = "6px";
    btn.style.border = "2px solid #ddd";
    btn.style.backgroundColor = hexColor;
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s ease";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const main = document.getElementById("product-main-image");
      if (main) main.src = imageSrc;

      document.querySelectorAll(".color-swatch").forEach((s) => {
        s.style.border = "2px solid #ddd";
        s.style.transform = "scale(1)";
      });

      btn.style.border = "2px solid #000";
      btn.style.transform = "scale(1.1)";
    });

    return btn;
  }

  async function load() {
    // Atualiza nome do produto
    if (productName) {
      const titleElement =
        document.querySelector("h1.product-title") ||
        document.querySelector(".product h1") ||
        document.querySelector("h1");
      if (titleElement) {
        titleElement.textContent = decodeURIComponent(productName);
      }
    }

    // Busca produto
    let product = null;
    if (productId) {
      product = getProductById(parseInt(productId));
    } else if (productParam) {
      product = getProductBySlug(productParam);
    }

    console.log("Produto encontrado:", product);

    if (!product) {
      console.warn("Produto não encontrado no data.js");
      return;
    }

    // Carrega imagem principal
    const mainFound = await findFirstExisting([product.image]);
    if (mainFound) {
      insertMainImage(mainFound);
    } else {
      console.warn("Nenhuma imagem principal encontrada para:", product.image);
    }

    // Prepara container de cores
    let colorContainer = document.querySelector(".product .color-swatches");
    if (!colorContainer) {
      const productAside = document.querySelector(".product");
      if (productAside) {
        colorContainer = document.createElement("div");
        colorContainer.className = "color-swatches";
        colorContainer.style.marginTop = "12px";
        colorContainer.style.display = "flex";
        colorContainer.style.flexWrap = "wrap";
        colorContainer.style.gap = "8px";
        productAside.insertBefore(
          colorContainer,
          productAside.querySelector("hr") || null
        );
      }
    }

    if (colorContainer) {
      colorContainer.innerHTML = "";

      // Adiciona swatches
      for (const color of product.colors) {
        const found = await findFirstExisting([color.image]);
        if (found) {
          const hexColor = colorMap[color.name] || "#cccccc";
          const swatch = createSwatch(found, color.name, hexColor);
          colorContainer.appendChild(swatch);
          console.log("Swatch adicionado:", color.name);
        } else {
          console.warn("Imagem de cor não encontrada:", color.image);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();
