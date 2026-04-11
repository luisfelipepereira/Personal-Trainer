// 🔥 Vercel Speed Insights Loader
(function () {
  try {
    window.siq = window.siq || [];
    window.si =
      window.si ||
      function () {
        window.siq.push(arguments);
      };

    var script = document.createElement("script");
    script.src = "https://va.vercel-scripts.com/v1/speed-insights/script.js";
    script.async = true;

    script.onerror = function () {
      console.error("Erro ao carregar Speed Insights");
    };

    document.head.appendChild(script);
  } catch (error) {
    console.error("Falha na inicialização do Speed Insights:", error);
  }
})();