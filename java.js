fetch('const/products.html')
    .then(response => response.text())
    .then(data => {document.getElementById('products')
        .innerHTML = data;});

fetch('const/header.html')
    .then(response => response.text())
    .then(data => {document.getElementById('header')
        .innerHTML = data;});

fetch('const/footer.html')
    .then(response => response.text())
    .then(data => {document.getElementById('footer')
        .innerHTML = data;});

fetch('const/slider.html')
    .then(response => response.text())
    .then(data => {document.getElementById('slider')
        .innerHTML = data;});

fetch('const/categories.html')
    .then(response => response.text())
    .then(data => {document.getElementById('categories')
        .innerHTML = data;});

fetch('const/product_grid.html')
    .then(response => response.text())
    .then(data => {document.getElementById('product_grid')
        .innerHTML = data;});

fetch('const/promotion_bar.html')
    .then(response => response.text())
    .then(data => {document.getElementById('promotion_bar')
        .innerHTML = data;});

fetch('const/categories.html')
    .then(response => response.text())
    .then(data => {document.getElementById('categories')
        .innerHTML = data;});


// Mobile menu toggle
    const btnMobile = document.getElementById('btn-mobile');
    const mobileMenu = document.getElementById('mobile-menu');
    btnMobile.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

// Simple slider logic
    const slides = document.getElementById('slides');
    const totalSlides = slides.children.length;
    let index = 0;
    document.getElementById('next').addEventListener('click', () => {
      index = (index + 1) % totalSlides;
      slides.style.transform = `translateX(-${index * 100}%)`;
    });
    document.getElementById('prev').addEventListener('click', () => {
      index = (index - 1 + totalSlides) % totalSlides;
      slides.style.transform = `translateX(-${index * 100}%)`;
    });

// Auto-advance (optional)
    setInterval(() => { index = (index + 1) % totalSlides; slides.style.transform = `translateX(-${index * 100}%)`; }, 6000);