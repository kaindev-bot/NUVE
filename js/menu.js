/* TOPO FIXO + MENU HAMBÚRGUER (celular): abre, fecha por link, Esc ou mudança de tamanho de tela. */
(function () {
  var h = document.querySelector("header"),
    b = h.querySelector(".burger");
  function set(o) {
    h.classList.toggle("open", o);
    b.setAttribute("aria-expanded", o);
    b.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu");
    document.documentElement.style.overflow = o ? "hidden" : "";
  }
  b.addEventListener("click", function () {
    set(!h.classList.contains("open"));
  });
  h.querySelectorAll("nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      set(false);
    });
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") set(false);
  });
  matchMedia("(min-width:861px)").addEventListener("change", function () {
    set(false);
  });
})();

/* Topo fixo: ganha fundo sólido (classe "rolou") depois de rolar um pouco */
(function () {
  var h = document.querySelector("header");
  function atualizar() {
    h.classList.toggle(
      "rolou",
      window.scrollY > 20 || h.hasAttribute("data-fixo"),
    );
  }
  addEventListener("scroll", atualizar, { passive: true });
  atualizar();
})();
