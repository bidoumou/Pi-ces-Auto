import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis} from "./avis.js";

let pieces = window.localStorage.getItem("pieces");

if(pieces === null){
    const reponse = await fetch("http://localhost:8081/pieces");
    pieces = await reponse.json();
    const valeurPieces = JSON.stringify(pieces);
    window.localStorage.setItem("pieces", valeurPieces);
}
else{
    pieces = JSON.parse(pieces);
}

window.localStorage.setItem("nom", "Les Bonnes Pièces !");

ajoutListenerEnvoyerAvis();


function genererPieces(pieces){
    for(let i = 0; i < pieces.length; i++){
        const article = pieces[i];
        const sectionFiches = document.querySelector(".fiches");
        const pieceElement = document.createElement("article");
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
    
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
    
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix ${article.prix}€ (${article.prix < 35 ? "€" : "€€€"})`;
    
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
    
        const dispoElement = document.createElement("p");
        dispoElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";
    
        
        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(dispoElement);
        pieceElement.appendChild(avisBouton);
    }

    ajoutListenersAvis();
}



function btnFiltres() {

    let fiche = document.querySelector(".fiches");

    const boutonTrierIncr = document.querySelector(".btn-trier-incr");
    boutonTrierIncr.addEventListener("click", () => {
        const piecesOrdonnees = Array.from(pieces);
        piecesOrdonnees.sort(function (a, b) {
            return a.prix - b.prix;
        });
        fiche.innerHTML = "";
        genererPieces(piecesOrdonnees);
    });


    const boutonTrierDecr = document.querySelector(".btn-trier-decr");
    boutonTrierDecr.addEventListener("click", () => {
        const piecesOrdonnees = Array.from(pieces);
        piecesOrdonnees.sort(function (a, b) {
            return b.prix - a.prix;
        });
        fiche.innerHTML = "";
        genererPieces(piecesOrdonnees);
    });

    const boutonFiltrer = document.querySelector(".btn-filtrer");
    boutonFiltrer.addEventListener("click", () => {
        const piecesFiltrees = pieces.filter(function (piece) {
            return piece.prix <= 35;
        });
        fiche.innerHTML = "";
        genererPieces(piecesFiltrees);
    });

    const boutonDescription = document.querySelector(".btn-filtre-description");
    boutonDescription.addEventListener("click", () => {
        const piecesFiltrees = pieces.filter(function (piece) {
            return piece.description;
        });
        fiche.innerHTML = "";
        genererPieces(piecesFiltrees);
    });

    const inputPrixMax = document.querySelector("#prix-max");
    inputPrixMax.addEventListener("input", () => {
        const piecesFiltrees = pieces.filter(function (piece){
            return piece.prix <= inputPrixMax.value;
        });
        fiche.innerHTML = "";
        genererPieces(piecesFiltrees);
    });
}

function affichageProduitsSpe(pieces) {
    const nomsAbordables = pieces.map(piece => piece.nom);
    for (let i = pieces.length - 1; i >= 0; i--) {
        if (pieces[i].prix > 35) {
            nomsAbordables.splice(i, 1);
        }
    }

    const abordablesElements = document.createElement("ul");
    for (let i = 0; i < nomsAbordables.length; i++) {
        const nomElement = document.createElement("li");
        nomElement.innerText = nomsAbordables[i];
        abordablesElements.appendChild(nomElement);
    }
    document.querySelector(".abordables").appendChild(abordablesElements);

    const nomsEnStock = pieces.map(piece => `${piece.nom} - ${piece.prix} €`);
    for (let i = pieces.length - 1; i >= 0; i--) {
        if (!pieces[i].disponibilite) {
            nomsEnStock.splice(i, 1);
        }
    }

    const enStockElement = document.createElement("ul");
    for (let i = 0; i < nomsEnStock.length; i++) {
        const nomElement = document.createElement("li");
        nomElement.innerText = nomsEnStock[i];
        enStockElement.appendChild(nomElement);
    }
    document.querySelector(".enStock").appendChild(enStockElement);
}

function majPieces(){
    const boutonMettreAJour = document.querySelector(".btn-maj");
    boutonMettreAJour.addEventListener("click", () => {
        window.localStorage.removeItem("pieces");
    });
}


function main(pieces){
    genererPieces(pieces);

    for(let i = 0; i < pieces.length; i++){
        const id = pieces[i].id;
        const avisJSON = window.localStorage.getItem(`avis-id="${id}`);
        const avis = JSON.parse(avisJSON);

        if(avis !== null){
            const pieceElement = document.querySelector(`article[data-id="${id}"]`);
            afficherAvis(pieceElement, avis);
        }
    }

    btnFiltres();
    affichageProduitsSpe(pieces);
    majPieces();
    
}

main(pieces);
