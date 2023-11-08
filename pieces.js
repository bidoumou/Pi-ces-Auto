// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();


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

    
    sectionFiches.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(dispoElement);
}

const boutonTrierIncr = document.querySelector(".btn-trier-incr");
boutonTrierIncr.addEventListener("click", () =>{
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b){
        return a.prix - b.prix;
    });
    console.log(piecesOrdonnees);
});

const boutonTrierDecr = document.querySelector(".btn-trier-decr");
boutonTrierDecr.addEventListener("click", () =>{
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b){
        return b.prix - a.prix;
    });
    console.log(piecesOrdonnees);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", () =>{
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= 35;
    });
    console.log(piecesFiltrees);
});

const boutonDescription = document.querySelector(".btn-filtre-description");
boutonDescription.addEventListener("click", () =>{
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.description;
    });
    console.log(piecesFiltrees);
});

const nomsAbordables = pieces.map(piece => piece.nom);

for(let i = pieces.length-1; i >= 0; i--){
    if(pieces[i].prix > 35){
        nomsAbordables.splice(i,1);
    }
}

const abordablesElements = document.createElement("ul");
for(let i = 0; i < nomsAbordables.length; i++){
    const nomElement = document.createElement("li");
    nomElement.innerText = nomsAbordables[i];
    abordablesElements.appendChild(nomElement);
}
document.querySelector(".abordables").appendChild(abordablesElements);

const nomsEnStock = pieces.map(piece => `${piece.nom} - ${piece.prix} €`);
for(let i = pieces.length-1; i >= 0; i--){
    if(!pieces[i].disponibilite){
        nomsEnStock.splice(i,1);
    }
}

const enStockElement = document.createElement("ul");
for(let i = 0; i < nomsEnStock.length; i++){
    const nomElement = document.createElement("li");
    nomElement.innerText = nomsEnStock[i];
    enStockElement.appendChild(nomElement);
}
document.querySelector(".enStock").appendChild(enStockElement);