const vagas = database;

const carros = ["car1.png", "car2.png", "car3.png", "car4.png", "car5.png", "car6.png"];

var vagasLivres = 0;

function montarEstacionamento(){
    desmontarEstacionamento();

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

    for(var i = 0; i < vagas.length; i++){
        console.log('entrou');
        var card = document.createElement("div");
        var span = document.createElement("span");
        var img = document.createElement("img");

        card.setAttribute("id", `vaga-${vagas[i].code}`);
        card.setAttribute("class", "vaga-card");

        span.setAttribute("id", `span-${vagas[i].code}`);
        span.appendChild(document.createTextNode(vagas[i].code));

        img.setAttribute("id", `img-${vagas[i].code}`);

        if(vagas[i].isFree == false){
            var random = Math.floor(Math.random() * carros.length);;
            img.setAttribute("src", `images/${carros[random]}`);
            card.style.borderColor = "#FF1515";
        }
        else{
            vagasLivres++;
        }

        card.appendChild(span);
        card.appendChild(img);

        divVagas.appendChild(card);
    }

    info.appendChild(document.createTextNode("Quantidade de vagas livres: " + vagasLivres));

    divContent.appendChild(divVagas);
    
    container.appendChild(info)
    container.appendChild(divContent);
}

function desmontarEstacionamento(){
    var content = document.getElementById("content");

    if(content){
        document.getElementById("content").remove();
    }
}

montarEstacionamento();