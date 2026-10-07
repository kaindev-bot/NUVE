/* =====================================================
   NUVEM 3D
   Monta a nuvem do logo em 3D (Three.js) no topo e atrás do chamado final.
   As cores vêm de css/cores.css (--nuvem-frente e --nuvem-lateral).
   ===================================================== */
(function () {
  /* ---- Ajustes (pode mexer) ---- */
  var CFG = {
    profundidade: 46, // espessura da nuvem
    luz: { ambiente: 0.485, principal: 0.635, azul: 0.25 },
    topo: { tamanho: 0.62, giroBase: -0.4, balanco: 0.3, mouse: 0.9 }, // tamanho = fração da largura
    final: { larguraMax: 680, giroBase: -0.25, balanco: 0.22, mouse: 0.6 },
  };

  var css = getComputedStyle(document.documentElement);
  function cor(nome, padrao) {
    return css.getPropertyValue(nome).trim() || padrao;
  }
  var FRENTE = cor("--nuvem-frente", "#a1d7f4");
  var LATERAL = cor("--nuvem-lateral", "#3f86bb");
  var reduzMovimento = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var palco = document.querySelector(".stage");
  var caixaFinal = document.getElementById("nuvem-final");
  var T = window.THREE,
    dados = window.NUVE_NUVEM;
  var lista = [],
    mx = 0,
    my = 0,
    t0 = performance.now();

  /* ---- Plano B: sem WebGL, usa camadas de SVG empilhadas ---- */
  function rgb(hex) {
    return /^#[0-9a-f]{6}$/i.test(hex)
      ? [1, 3, 5].map(function (i) {
          return parseInt(hex.substr(i, 2), 16);
        })
      : null;
  }
  function camadasSVG() {
    var rig = document.querySelector(".rig"),
      a = rgb(FRENTE) || [161, 215, 244],
      b = rgb(LATERAL) || [63, 134, 187],
      N = 16;
    if (!rig) return;
    rig.classList.add("nuvem-fade");
    for (var i = N - 1; i >= 0; i--) {
      var t = i / (N - 1),
        c = a.map(function (v, k) {
          return Math.round(v + (b[k] - v) * t);
        });
      var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("viewBox", "0 0 340 176");
      s.setAttribute("class", "layer");
      s.style.color = "rgb(" + c + ")";
      s.style.transform = "translateZ(" + (-i * 6 + 40) + "px)";
      s.innerHTML = '<use href="#m"/>';
      rig.appendChild(s);
    }
    if (!reduzMovimento)
      addEventListener("pointermove", function (e) {
        rig.style.setProperty(
          "--ry",
          (e.clientX / innerWidth - 0.5) * 44 - 4 + "deg",
        );
        rig.style.setProperty(
          "--rx",
          10 - (e.clientY / innerHeight - 0.5) * 28 + "deg",
        );
      });
  }
  if (!T || !dados) {
    camadasSVG();
    return;
  }

  /* ---- Forma 3D: contorno externo com o furo interno, extrudada ---- */
  var cx = 419.35,
    cy = 228.85; // centro do logo
  function pontos(a) {
    return a.map(function (p) {
      return new T.Vector2(p[0] - cx, -(p[1] - cy));
    });
  }
  var forma = new T.Shape(pontos(dados.contorno));
  forma.holes.push(new T.Path(pontos(dados.furo)));
  var geo = new T.ExtrudeGeometry(forma, {
    depth: CFG.profundidade,
    bevelEnabled: true,
    bevelSize: 1.2,
    bevelOffset: -1.2,
    bevelThickness: 2,
    bevelSegments: 2,
  });
  geo.translate(0, 0, -CFG.profundidade / 2);
  var matFrente = new T.MeshStandardMaterial({
    color: FRENTE,
    roughness: 0.5,
    metalness: 0,
  });
  var matLateral = new T.MeshStandardMaterial({
    color: LATERAL,
    roughness: 0.4,
    metalness: 0.15,
  });

  /* ---- Cria uma cena 3D dentro de uma caixa ---- */
  function criar(caixa, o) {
    var r;
    try {
      r = new T.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return false;
    }
    var m = new T.Mesh(geo, [matFrente, matLateral]),
      cena = new T.Scene(),
      cam = new T.PerspectiveCamera(30, 1.93, 1, 3000);
    var l1 = new T.DirectionalLight(0xffffff, CFG.luz.principal),
      l2 = new T.DirectionalLight(0x7ec3ee, CFG.luz.azul);
    l1.position.set(-200, 300, 400);
    l2.position.set(300, -120, 200);
    cena.add(m, new T.AmbientLight(0xffffff, CFG.luz.ambiente), l1, l2);
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.domElement.style.cssText = o.css;
    if (o.entrada) r.domElement.classList.add("nuvem-entrada"); // fade + zoom leve (css/hero.css)
    caixa.appendChild(r.domElement);
    m.rotation.set(0.15, o.giroBase, 0);
    var item = { r: r, cena: cena, cam: cam, m: m, o: o, visivel: true };
    function medir() {
      var w = caixa.clientWidth * o.k,
        h = caixa.clientHeight * o.k;
      if (!w || !h) return;
      r.setSize(w, h, false);
      cam.aspect = w / h;
      cam.position.z =
        340 / o.tamanho(w) / cam.aspect / (2 * Math.tan(Math.PI / 12));
      cam.updateProjectionMatrix();
      if (reduzMovimento) r.render(cena, cam);
    }
    medir();
    addEventListener("resize", medir);
    if ("IntersectionObserver" in window)
      new IntersectionObserver(function (e) {
        item.visivel = e[0].isIntersecting;
      }).observe(o.observar);
    lista.push(item);
    return true;
  }

  if (
    palco &&
    criar(palco, {
      k: 1.3,
      tamanho: function () {
        return CFG.topo.tamanho;
      },
      css: "position:absolute;left:-15%;top:-15%;width:130%;height:130%;pointer-events:none",
      entrada: true,
      giroBase: CFG.topo.giroBase,
      balanco: CFG.topo.balanco,
      mouse: CFG.topo.mouse,
      observar: document.querySelector(".hero"),
    })
  ) {
    var balanco = document.querySelector(".sway"); // esconde o plano B
    if (balanco) balanco.style.display = "none";
  } else camadasSVG();

  if (caixaFinal)
    criar(caixaFinal, {
      k: 1,
      tamanho: function (w) {
        return Math.min(CFG.final.larguraMax, w * 0.9) / w;
      },
      css: "position:absolute;inset:0;width:100%;height:100%;opacity:.42", // opacidade da nuvem do chamado final
      giroBase: CFG.final.giroBase,
      balanco: CFG.final.balanco,
      mouse: CFG.final.mouse,
      observar: caixaFinal.parentNode,
    });

  // Nuvens no meio do conteúdo: o zero da página 404 e o aviso "Em breve" de projetos.html
  ["nuvem-404", "nuvem-vazio"].forEach(function (id) {
    var caixa = document.getElementById(id);
    if (!caixa || caixa.closest("[hidden]")) return; // não cria se estiver escondida
    var ok = criar(caixa, {
      k: 1.5,
      tamanho: function () {
        return 0.7;
      },
      css: "position:absolute;left:-25%;top:-25%;width:150%;height:150%;pointer-events:none",
      giroBase: -0.35,
      balanco: 0.3,
      mouse: 0.9,
      entrada: true,
      observar: caixa,
    });
    var estatica = caixa.querySelector(".zero-svg, .nuvem-2d"); // desenho 2D (plano B)
    if (ok && estatica) estatica.style.visibility = "hidden";
  });

  if (reduzMovimento) return;
  addEventListener("pointermove", function (e) {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
  });
  (function animar(agora) {
    requestAnimationFrame(animar);
    if (document.hidden) return;
    var t = (agora - t0) / 1000;
    lista.forEach(function (it) {
      if (!it.visivel) return;
      var o = it.o,
        m = it.m;
      var giroY = o.giroBase + Math.sin(t * 0.7) * o.balanco + mx * o.mouse,
        giroX = 0.12 + my * 0.5;
      m.rotation.y += (giroY - m.rotation.y) * 0.06;
      m.rotation.x += (giroX - m.rotation.x) * 0.06;
      m.position.y = Math.sin(t * 1.1) * 5;
      it.r.render(it.cena, it.cam);
    });
  })(t0);
})();
