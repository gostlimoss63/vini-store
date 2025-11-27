// Adicione ao final do arquivo, fora da IIFE anterior:
document.addEventListener("DOMContentLoaded", () => {
  const btnVoltar = document.getElementById("btn-voltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      window.history.back(); // volta à página anterior
      // OU use isso se quiser ir direto para vintcy-store:
      // window.location.href = "../vintcy-store/index.html";
    });

    // Efeito hover
    btnVoltar.addEventListener("mouseover", () => {
      btnVoltar.style.backgroundColor = "#333";
    });
    btnVoltar.addEventListener("mouseout", () => {
      btnVoltar.style.backgroundColor = "#000";
    });
  }
});
