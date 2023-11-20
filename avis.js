/* global Chart */

export function ajoutListenersAvis(){
    const piecesElements = document.querySelectorAll(".fiches article button");

    for(let i = 0; i < piecesElements.length; i++){
        piecesElements[i].addEventListener("click", async function (event){
            const id = event.target.dataset.id;
            const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
            const avis = await reponse.json();
            window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));

            const pieceElement = event.target.parentElement;
            afficherAvis(pieceElement, avis);
        });
    }
}

export function afficherAvis(pieceElement, avis){
    const avisElement = document.createElement("p");
    for(let i = 0; i < avis.length; i++){
        avisElement.innerHTML = `<b>${avis[i].utilisateur} :<b> ${avis[i].commentaire} <br>`;
    }
    pieceElement.appendChild(avisElement);
}

export function ajoutListenerEnvoyerAvis(){
    const formAvis = document.querySelector(".formulaire-avis");
    formAvis.addEventListener("submit", (event) => {
        event.preventDefault();
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=note]").value)
        };

        const chargeUtile = JSON.stringify(avis);

        fetch("http://localhost:8081/avis",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        });
    });
}

export async function afficherGraphiqueAvis() {

    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const nb_commentaires = [0, 0, 0, 0, 0];

    for(let commentaire of avis){
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }

    const labels = ["5", "4", "3", "2", "1"];
    
    const data = {
        labels: labels,
        datasets: [{
            label: "Etoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255,230,0,1)",
        }],
    };

    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };

    new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );

    const piecesJSON = window.localStorage.getItem("pieces");
    const pieces = JSON.parse(piecesJSON);
    
    let nbCommentairesDispo = 0;
    let nbCommentairesNonDispo = 0;

    for(let i = 0; i < avis.length; i++){
        const piece = pieces.find(p => p.id === avis[i].pieceId);

        if(piece){
            nbCommentairesDispo++;
        }
        else{
            nbCommentairesNonDispo++;
        }
    }

    const labelsDispo = ["Disponibles", "Non-disponibles"];

    const dataDispo = {
        labels: labelsDispo,
        datasets: [{
            label: "Nombre de pièces",
            data: [nbCommentairesDispo, nbCommentairesNonDispo],
            backgroundColor: "rgba(0,230,255,1)",
        }],
    };

    const configDispo = {
        type: "bar",
        data: dataDispo,
    };

    new Chart(
        document.querySelector("#graphique-dispo"),
        configDispo,
    );
}

