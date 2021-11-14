const vagas = database;

const carros = ["car1.png", "car2.png", "car3.png", "car4.png", "car5.png", "car6.png", "car7.png"];

const limite = 55;

var vagasLivres = 0;

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

        for (var i = 0; i < vagas.length; i++) {
            var card = document.createElement("div");
            var span = document.createElement("span");
            var img = document.createElement("img");

            card.setAttribute("id", `vaga-${vagas[i].code}`);
            card.setAttribute("class", "vaga-card");

            span.setAttribute("id", `span-${vagas[i].code}`);
            span.appendChild(document.createTextNode(vagas[i].code));

            img.setAttribute("id", `img-${vagas[i].code}`);

            if (vagas[i].isFree == false) {
                var random = Math.floor(Math.random() * carros.length);;
                img.setAttribute("src", `images/${carros[random]}`);
                card.style.borderColor = "#FF1515";
                card.setAttribute("isFree", false);
            }
            else {
                vagasLivres++;
                card.setAttribute("isFree", true);
            }

            card.appendChild(span);
            card.appendChild(img);

            divVagas.appendChild(card);
        }

        info.appendChild(document.createTextNode("Quantidade de vagas livres: " + vagasLivres));

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
        socket.on('message', function (msg) {
            console.log(msg);

            var isFree = document.getElementById('vaga-A1').getAttribute('isFree');

            if ((parseFloat(msg) <= limite && isFree === "true") || (parseFloat(msg) > limite && isFree === "false")) {
                app.mudarStatusVaga("A1", 1);
                for (var i = 1; i < vagas.length; i++) {
                    app.mudarStatusVaga(vagas[i].code, i / 100 * 5)
                }

                document.getElementById('informations').innerHTML = `Quantidade de vagas livres: ${vagasLivres}`;
            }
        });
    },

    mudarStatusVaga: function (code, chance) {
        var randonFactor = Math.random();
        
        if(randonFactor <= chance){
            var random = Math.floor(randonFactor * carros.length);
            var card = document.getElementById(`vaga-${code}`);
            var isFree = card.getAttribute('isFree');
    
            var img = document.getElementById(`img-${code}`);

            if (isFree === "true") {
                img.setAttribute("src", `images/${carros[random]}`);
                card.style.borderColor = "#FF1515";
                card.setAttribute("isFree", false);
                vagasLivres--;
            }
            else {
                img.setAttribute("src", "");
                card.style.borderColor = "var(--color-yellow)";
                card.setAttribute("isFree", true);
                vagasLivres++;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    app.init();
});

