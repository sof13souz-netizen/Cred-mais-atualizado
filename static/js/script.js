const topo = document.getElementById("topo");

if (!topo) {
    console.warn("Elemento topo não encontrado.");
} else {
    const links = [...topo.querySelectorAll("a")];
    const marcador = topo.querySelector(".marcador");
    const secoes = [...document.querySelectorAll("[data-secao]")];

    let secaoAtual = null;
    let rolandoPorClique = false;
    let tempoParaLiberarRolagem;

    const ESCALA = 1.12;

    // Posiciona o marcador azul.
    function posicionarMarcador(animar = true) {
        const linkAtivo = topo.querySelector("a.ativo");

        if (!linkAtivo || !marcador) {
            return;
        }

        marcador.style.transition = animar ? "" : "none";
        marcador.style.width = linkAtivo.offsetWidth * ESCALA + "px";

        const posicao = linkAtivo.offsetLeft -
            (linkAtivo.offsetWidth * (ESCALA - 1)) / 2;

        marcador.style.transform = `translateX(${posicao}px)`;

        if (!animar) {
            
            marcador.offsetWidth;
            marcador.style.transition = "";
        }
    }

    // Atualiza o link ativo.
    function ativarSecao(id, animar = true) {
        if (id === secaoAtual) {
            return;
        }

        secaoAtual = id;

        links.forEach(function (link) {
            const linkCorreto = link.getAttribute("href") === "#" + id;

            link.classList.toggle("ativo", linkCorreto);

            if (linkCorreto) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        posicionarMarcador(animar);
    }

    // Descobre a seção atual.
    function descobrirSecao() {
        const linhaDeReferencia = window.innerHeight * 0.4;
        let id = secoes.length ? secoes[0].dataset.secao : "inicio";

        secoes.forEach(function (secao) {
            if (secao.getBoundingClientRect().top <= linhaDeReferencia) {
                id = secao.dataset.secao;
            }
        });

        const chegouAoFim = window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 4;

        if (chegouAoFim) {
            return "contato";
        }

        return id;
    }

    // Rola até a seção escolhida.
    function rolarAte(secao) {
        if (!secao) {
            return;
        }

        let destino = 0;

        if (secao.id !== "inicio") {
            destino = secao.getBoundingClientRect().top +
                window.scrollY - topo.offsetHeight;
        }

        const limiteDaPagina = document.documentElement.scrollHeight -
            window.innerHeight;

        destino = Math.max(0, Math.min(destino, limiteDaPagina));

        const distancia = Math.abs(destino - window.scrollY);

        if (movimentoReduzido || distancia < 2) {
            window.scrollTo(0, destino);
            return;
        }

        rolandoPorClique = true;
        window.scrollTo({ top: destino, behavior: "smooth" });

        clearTimeout(tempoParaLiberarRolagem);
        const tempoEstimado = Math.min(1200, Math.max(700, distancia * 0.8));

        tempoParaLiberarRolagem = setTimeout(function () {
            rolandoPorClique = false;
        }, tempoEstimado + 120);
    }

    ["wheel", "touchmove"].forEach(function (evento) {
        window.addEventListener(evento, function () {
            clearTimeout(tempoParaLiberarRolagem);
            rolandoPorClique = false;
        }, { passive: true });
    });

    // Cliques no menu.
    links.forEach(function (link) {
        link.addEventListener("click", function (evento) {
            evento.preventDefault();

            const id = link.getAttribute("href").slice(1);
            ativarSecao(id);
            rolarAte(document.getElementById(id));
            history.replaceState(null, "", "#" + id);
        });
    });

    // Atualiza o menu ao rolar a página.
    let esperandoAtualizacao = false;

    function atualizarAoRolar() {
        if (esperandoAtualizacao) {
            return;
        }

        esperandoAtualizacao = true;

        requestAnimationFrame(function () {
            esperandoAtualizacao = false;
            topo.classList.toggle("colado", window.scrollY > 40);

            if (!rolandoPorClique) {
                ativarSecao(descobrirSecao());
            }
        });
    }

    window.addEventListener("scroll", atualizarAoRolar, { passive: true });

    // Prepara os elementos para as animações do CSS.
    const elementosParaRevelar = document.querySelectorAll(
        ".card, .motivo, .passo, .objetivo > *, " +
        ".secao > h2, .secao > .sobretitulo, .secao > .subtitulo"
    );

    elementosParaRevelar.forEach(function (elemento) {
        elemento.classList.add("revelar");
    });

    // Mostra os elementos quando aparecem na tela.
    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".revelar").forEach(function (elemento) {
            observador.observe(elemento);
        });
    }

    topo.classList.toggle("colado", window.scrollY > 40);
    ativarSecao(descobrirSecao(), false);

    if (document.fonts) {
        document.fonts.ready.then(function () {
            posicionarMarcador(false);
        });
    }

    window.addEventListener("resize", function () {
        posicionarMarcador(false);
    });
}
