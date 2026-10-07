/* =====================================================
   PÁGINA DE PROJETOS
   Monta a grade, os filtros e a janela de detalhes a partir de
   js/projetos-dados.js. Não precisa mexer aqui para adicionar projetos.
   ===================================================== */
(function () {
  var lista = window.NUVE_PROJETOS || [];
  var NOMES = {
    posts: "Posts",
    "pos-producao": "Pós-produção",
    "direcao-de-arte": "Direção de arte",
  };
  var grade = document.getElementById("grade");
  var vazio = document.getElementById("vazio");
  var filtros = document.getElementById("filtros");
  var janela = document.getElementById("detalhe");

  // Sem projetos: só mostra o aviso "Em breve"
  if (!lista.length) {
    filtros.hidden = true;
    grade.hidden = true;
    vazio.hidden = false;
    document.querySelector(".proj-lista").classList.add("sem-projetos"); // faixa escura
    return;
  }
  vazio.hidden = true;

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }
  function nomeCategoria(c) {
    return NOMES[c] || c;
  }
  function legenda(p) {
    return nomeCategoria(p.categoria) + (p.ano ? " · " + p.ano : "");
  }

  /* ---- Cartões ---- */
  var cartoes = lista.map(function (p) {
    var b = el("button", "proj-card");
    b.type = "button";
    b.dataset.categoria = p.categoria;
    var caixa = el("div", "proj-img");
    var img = document.createElement("img");
    img.src = p.imagem;
    img.alt = p.alt || p.nome;
    img.loading = "lazy";
    caixa.appendChild(img);
    b.appendChild(caixa);
    b.appendChild(el("p", "proj-nome", p.nome));
    b.appendChild(el("p", "proj-cat", legenda(p)));
    b.addEventListener("click", function () {
      abrir(p);
    });
    grade.appendChild(b);
    return b;
  });

  /* ---- Filtros (só das categorias que existem) ---- */
  var categorias = [];
  lista.forEach(function (p) {
    if (categorias.indexOf(p.categoria) < 0) categorias.push(p.categoria);
  });
  function filtrar(cat) {
    cartoes.forEach(function (c) {
      c.hidden = cat !== "todos" && c.dataset.categoria !== cat;
    });
    Array.prototype.forEach.call(filtros.children, function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.cat === cat));
    });
  }
  if (categorias.length > 1) {
    ["todos"].concat(categorias).forEach(function (cat) {
      var b = el(
        "button",
        "filtro",
        cat === "todos" ? "Todos" : nomeCategoria(cat),
      );
      b.type = "button";
      b.dataset.cat = cat;
      b.addEventListener("click", function () {
        filtrar(cat);
      });
      filtros.appendChild(b);
    });
    filtrar("todos");
  } else {
    filtros.hidden = true;
  }

  /* ---- Janela de detalhes ---- */
  function abrir(p) {
    var img = document.getElementById("det-img");
    img.src = p.imagem;
    img.alt = p.alt || p.nome;
    document.getElementById("det-cat").textContent = legenda(p);
    document.getElementById("det-nome").textContent = p.nome;
    document.getElementById("det-desc").textContent = p.descricao || "";
    janela.showModal();
  }
  janela.querySelector(".fechar").addEventListener("click", function () {
    janela.close();
  });
  janela.addEventListener("click", function (e) {
    if (e.target === janela) janela.close();
  }); // clique fora
})();
