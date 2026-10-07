/* =====================================================
   CARREGAR O 3D DEPOIS
   O texto e os botões do topo aparecem primeiro. Só depois que a página
   terminou de carregar é que baixamos o Three.js e montamos a nuvem 3D.
   ===================================================== */
(function () {
  // pasta onde este arquivo está (funciona também na página 404)
  var pasta = document.currentScript
    ? document.currentScript.src.replace(/[^\/]*$/, "")
    : "js/";
  var arquivos = [
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    pasta + "dados-logo.js",
    pasta + "nuvem-3d.js",
  ];
  function carregar(i) {
    if (i >= arquivos.length) return;
    var s = document.createElement("script");
    s.src = arquivos[i];
    // se o Three.js falhar, segue mesmo assim: a nuvem usa o plano B (camadas)
    s.onload = s.onerror = function () {
      carregar(i + 1);
    };
    document.head.appendChild(s);
  }
  function iniciar() {
    setTimeout(function () {
      carregar(0);
    }, 50);
  }
  if (document.readyState === "complete") iniciar();
  else addEventListener("load", iniciar);
})();
