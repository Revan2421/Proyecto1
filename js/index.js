function initConfig() {
    document.getElementById("titulo-ATI").innerHTML = config.site[0] + "<span>" + config.site[1] + "</span>" + config.site[2];
    document.getElementById("input-busqueda").placeholder = config.name + "...";
    document.getElementById("btn-busqueda").textContent = config.search;
    document.getElementById("icono-perfil").alt = config.profile;
    document.getElementById("titulo-semestre").textContent = config.semester;
    document.getElementById("copyright").textContent = config.copyRight;
}

function cargarPerfiles() {
    const grid = document.getElementById("student-grid");

    profiles.forEach(perfil => {
        const card = document.createElement("a");
        card.className = "student-card";

        card.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = `profile.html?ci=${perfil.ci}`;
        });
        const img = document.createElement("img");
        img.className = "card-img";
        img.src = `${perfil.ci}/${perfil.ci}Small${perfil.image_ext}`;
        img.alt = perfil.name;
        const infoDiv = document.createElement("div");
        infoDiv.className = "card-info";
        const nameP = document.createElement("p");
        nameP.textContent = perfil.name;
        infoDiv.appendChild(nameP);
        const barDiv = document.createElement("div");
        barDiv.className = "card-bar";
        card.appendChild(img);
        card.appendChild(infoDiv);
        card.appendChild(barDiv);
        grid.appendChild(card);
    });
}

initConfig();
cargarPerfiles();
