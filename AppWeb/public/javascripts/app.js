var socket = io();

var app = {

    init: function () {
        app.montarEstacionamento();
        app.receberMensagemServidor();
    },

    montarEstacionamento: function () {
        app.desmontarEstacionamento();

        var container = document.getElementById("container");
        var divContent = document.createElement("div");
        var divVagas = document.createElement("div");
        var info = document.createElement("p");

        divContent.setAttribute("id", "content");
        divContent.setAttribute("class", "content");

        divVagas.setAttribute("id", "vagas");
        divVagas.setAttribute("class", "vagas");

        info.setAttribute("id", "informations");
        info.setAttribute("class", "informations");

        for (var i = 0; i < 10; i++) {
            var card = document.createElement("div");
            var span = document.createElement("span");
            var img = document.createElement("img");
            var vaga = (i < 5? "A" + (i+1) : "B" + (i-4));

            card.setAttribute("id", `vaga-${vaga}`);
            card.setAttribute("class", "vaga-card");
            card.style.borderColor = "var(--color-yellow)";

            span.setAttribute("id", `span-${vaga}`);
            span.appendChild(document.createTextNode(vaga));

            img.setAttribute("id", `img-${vaga}`);

            card.appendChild(span);
            card.appendChild(img);

            divVagas.appendChild(card);
        }

        info.appendChild(document.createTextNode("Quantidade de vagas livres: " + 10));

        divContent.appendChild(divVagas);

        container.appendChild(info)
        container.appendChild(divContent);
    },

    desmontarEstacionamento: function () {
        var content = document.getElementById("content");

        if (content) {
            document.getElementById("content").remove();
        }
    },

    receberMensagemServidor: function () {
        socket.on('message', function (data) {
            var objData = JSON.parse(data);

            app.AtualizarVagas(objData.database);
            document.getElementById('informations').innerHTML = `Quantidade de vagas livres: ${objData.vagasLivres}`;
            console.log(JSON.parse(data));
        });
    },

    AtualizarVagas: function (data) {

        data.forEach(function (item, index) {
            var card = document.getElementById(`vaga-${item.code}`);
            var img = document.getElementById(`img-${item.code}`);
            
            if (item.isFree) {
                img.setAttribute("src", "");
                card.style.borderColor = "var(--color-yellow)";
            }
            else{
                img.setAttribute("src", `images/${item.img}`);
                card.style.borderColor = "#FF1515";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    app.init();
});

