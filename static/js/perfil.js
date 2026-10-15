
document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("form-editar-perfil");

    const campoNovaSenha = document.getElementById("nova_senha");

    const mensagem = document.getElementById("mensagem-js");

    if (!formulario || !campoNovaSenha || !mensagem) {
        return;
    }

    formulario.addEventListener("submit", function (evento) {

        mensagem.textContent = "";
        mensagem.className = "mensagem-js";

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senhaAtual = document.getElementById("senha_atual").value;
        const novaSenha = campoNovaSenha.value;

        if (!nome || !email || !senhaAtual) {

            evento.preventDefault();

            mensagem.textContent =
                "Preencha nome, e-mail e senha atual.";
            mensagem.classList.add("erro");

            return;
        }

        if (novaSenha === "") {
            return;
        }

        const temMinuscula = /[a-z]/.test(novaSenha);

        const temMaiuscula = /[A-Z]/.test(novaSenha);

        const temNumero = /[0-9]/.test(novaSenha);

        const temSimbolo = /[^A-Za-z0-9]/.test(novaSenha);

        const tamanhoValido = novaSenha.length >= 8;

        if (
            !tamanhoValido ||
            !temMinuscula ||
            !temMaiuscula ||
            !temNumero ||
            !temSimbolo
        ) {

            evento.preventDefault(); //não aconteça o evento principal do elemento, ou seja, a página ser carregada
            mensagem.textContent =
                "A nova senha precisa ter pelo menos 8 caracteres, " +
                "uma letra maiúscula, uma minúscula, um número e um símbolo.";

            mensagem.classList.add("erro"); // adiciona a classe erro a esse elemento
        }

    });
});
