    // ------------------------------------------------------
    // 6.1 CONTROLE DE QUANTIDADE ( + / - )
    // ------------------------------------------------------
    (function(){
      const minus = document.getElementById('qtyMinus'),
            plus  = document.getElementById('qtyPlus'),
            val   = document.getElementById('qtyValue');

      let qty = parseInt(val?.textContent || '1',10) || 1;

      minus && minus.addEventListener('click', ()=>{
        if(qty>1){
          qty--;
          val.textContent = qty;
        }
      });

      plus && plus.addEventListener('click', ()=>{
        qty++;
        val.textContent = qty;
      });
    })();

    // ------------------------------------------------------
    // 6.2 BOTÃO "SELECIONAR IMAGEM" (abre o input file)
    // ------------------------------------------------------
    (function(){
      const fileBtn   = document.querySelector('.file-btn'),
            fileInput = document.getElementById('fileUpload');

      if(fileBtn && fileInput){
        fileBtn.addEventListener('click', ()=>fileInput.click());
      }
    })();

    // ------------------------------------------------------
    // 6.3 BOTÃO "VER MAIS" PRODUTOS RELACIONADOS
    // ------------------------------------------------------
    (function(){
      const btn  = document.getElementById('verMaisBtn'),
            more = document.getElementById('moreProducts');

      btn && btn.addEventListener('click', ()=> {
        const open = more.classList.toggle('open');
        more.setAttribute('aria-hidden', open ? 'false' : 'true');
        btn.textContent = open ? 'Ver menos' : 'Ver mais';
        btn.setAttribute('aria-expanded', String(open));
        if(open){
          more.scrollIntoView({behavior:'smooth',block:'center'});
        }
      });
    })();

    // ------------------------------------------------------
    // 6.4 CARROSSEL AUTOMÁTICO (relacionados)
    // ------------------------------------------------------
    (function(){
      const carousel = document.getElementById('relatedCarousel');
      if(!carousel) return;

      let auto;
      const speed = 2200; // ms
      const step  = 200;  // px

      function startAuto(){
        stopAuto();
        auto = setInterval(()=> {
          if(carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2){
            carousel.scrollTo({left:0,behavior:'smooth'});
          } else {
            carousel.scrollBy({left:step,behavior:'smooth'});
          }
        }, speed);
      }

      function stopAuto(){
        if(auto) clearInterval(auto);
        auto = null;
      }

      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
      carousel.addEventListener('touchstart', stopAuto, {passive:true});
      carousel.addEventListener('touchend', startAuto, {passive:true});

      startAuto();
    })();

    // ------------------------------------------------------
    // 6.5 SELEÇÃO DE CORES (swatches) + mudar imagem
    // ------------------------------------------------------
    (function(){
      const swatches = document.querySelectorAll('.color-swatches .swatch');

      function setImageById(id){
        const radio = document.getElementById(id);
        if(radio){ radio.checked = true; }
      }

      swatches.forEach(s => {
        const input = s.querySelector('input[type=radio]');

        s.addEventListener('click', ()=> {
          // visual de seleção
          swatches.forEach(x=>x.classList.remove('selected'));
          s.classList.add('selected');

          // selecionar o radio
          if(input) input.checked = true;

          // guardar cor escolhida em um input hidden
          let hidden = document.querySelector('input[name="color_selected"]');
          if(!hidden){
            hidden = document.createElement('input');
            hidden.type='hidden';
            hidden.name='color_selected';
            document.querySelector('.product').appendChild(hidden);
          }
          hidden.value = input ? input.value : s.getAttribute('data-value') || '';

          // pular para a imagem correspondente
          const imgId = s.getAttribute('data-image');
          if(imgId){
            setImageById(imgId);
            const gallerySection = document.querySelector('.gallery');
            if(gallerySection){
              try{
                gallerySection.focus({preventScroll:true});
              }catch(e){}
            }
          }
        });

        // acessibilidade: Enter ou espaço também selecionam
        s.addEventListener('keydown', (e)=>{
          if(e.key==='Enter' || e.key===' '){
            e.preventDefault();
            s.click();
          }
        });
      });

      // deixa a primeira cor selecionada por padrão
      const first = document.querySelector('.color-swatches .swatch');
      if(first) first.click();
    })();

    // ------------------------------------------------------
    // 6.6 SELEÇÃO DE TAMANHOS (P, M, G...)
    // ------------------------------------------------------
    (function(){
      const sizeBtns = document.querySelectorAll('.size-pills .size-btn');

      sizeBtns.forEach(btn=>{
        btn.addEventListener('click', ()=>{
          sizeBtns.forEach(b=>b.setAttribute('aria-pressed','false'));
          btn.setAttribute('aria-pressed','true');

          let hidden = document.querySelector('input[name="size_selected"]');
          if(!hidden){
            hidden = document.createElement('input');
            hidden.type='hidden';
            hidden.name='size_selected';
            document.querySelector('.product').appendChild(hidden);
          }
          hidden.value = btn.getAttribute('data-value') || '';
        });
      });

      // já salva o tamanho que vem marcado como padrão (P)
      (function(){
        const active = document.querySelector('.size-pills .size-btn[aria-pressed="true"]');
        if(active){
          let hidden = document.querySelector('input[name="size_selected"]');
          if(!hidden){
            hidden = document.createElement('input');
            hidden.type='hidden';
            hidden.name='size_selected';
            document.querySelector('.product').appendChild(hidden);
          }
          hidden.value = active.getAttribute('data-value') || '';
        }
      })();
    })();

    // ------------------------------------------------------
    // 6.7 EFEITO NAS CÉLULAS EDITÁVEIS (amarelinho ao focar)
    // ------------------------------------------------------
    (function(){
      document.querySelectorAll('.info-table td[contenteditable="true"]').forEach(td=>{
        td.addEventListener('focus', ()=>{
          td.style.background = 'rgba(255,250,235,0.6)';
        });
        td.addEventListener('blur', ()=>{
          td.style.background = 'transparent';
        });
      });
    })();

    // ------------------------------------------------------
    // 6.8 GALERIA: SETAS, TECLADO E SWIPE NO TOUCH
    // ------------------------------------------------------
    (function(){
      const radios   = Array.from(document.querySelectorAll('input[type=radio][name="gallery"]'));
      const prev     = document.getElementById('arrowPrev');
      const next     = document.getElementById('arrowNext');

      function getCurrentIndex(){
        return radios.findIndex(r => r.checked);
      }
      function setIndex(i){
        if(i < 0) i = radios.length - 1;
        if(i >= radios.length) i = 0;
        radios[i].checked = true;
        const gallerySection = document.querySelector('.gallery');
        if(gallerySection){
          try{
            gallerySection.focus({preventScroll:true});
          }catch(e){}
        }
      }

      prev && prev.addEventListener('click', (e)=>{
        e.preventDefault();
        setIndex(getCurrentIndex() - 1);
      });

      next && next.addEventListener('click', (e)=>{
        e.preventDefault();
        setIndex(getCurrentIndex() + 1);
      });

      // teclado (setas esquerda/direita)
      const gallerySection = document.querySelector('.gallery');
      if(gallerySection){
        gallerySection.tabIndex = 0;
        gallerySection.addEventListener('keydown', (e)=>{
          if(e.key === 'ArrowLeft'){
            e.preventDefault();
            setIndex(getCurrentIndex() - 1);
          }
          if(e.key === 'ArrowRight'){
            e.preventDefault();
            setIndex(getCurrentIndex() + 1);
          }
        });
      }

      // swipe no mobile
      let touchStartX = 0;
      const threshold = 40;
      const galleryImages = document.querySelector('.gallery-images');

      if(galleryImages){
        galleryImages.addEventListener('touchstart', (e)=> {
          touchStartX = e.changedTouches[0].clientX;
        }, {passive:true});

        galleryImages.addEventListener('touchend', (e)=> {
          const dx = e.changedTouches[0].clientX - touchStartX;
          if(Math.abs(dx) > threshold){
            if(dx > 0) setIndex(getCurrentIndex() - 1);
            else       setIndex(getCurrentIndex() + 1);
          }
        }, {passive:true});
      }
    })();

    // ------------------------------------------------------
    // 6.9 PREFERÊNCIA DE MOVIMENTO REDUZIDO
    // ------------------------------------------------------
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.documentElement.style.scrollBehavior = 'auto';
    }
