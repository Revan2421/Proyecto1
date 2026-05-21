function initConfig() {
    document.getElementById("titulo-ATI").innerHTML = config.site[0] + "<span>" + config.site[1] + "</span>" + config.site[2];
    document.getElementById("input-busqueda").placeholder = config.name + "...";
    document.getElementById("btn-busqueda").textContent = config.search;
    document.getElementById("icono-perfil").alt = config.profile;
    document.getElementById("label-perfil").textContent = config.profile;
    document.getElementById("titulo-semestre").textContent = config.semester;
    document.getElementById("copyright").textContent = config.copyRight;
}

function cargarPerfiles(lista = profiles) {
    const grid = document.getElementById("student-grid");
    grid.innerHTML = ""; // Limpiamos el grid antes de pintar

    if (lista.length === 0) {
        // Si la lista está vacía, mostramos el mensaje del JSON
        const inputBuscador = document.getElementById("input-busqueda").value;
        const mensajeError = config.no_results.replace("[query]", `<strong>${inputBuscador}</strong>`);
        
        // Creamos un elemento para el mensaje
        const mensaje = document.createElement("p");
        mensaje.innerHTML = mensajeError;
        mensaje.style.textAlign = "center";
        mensaje.style.width = "100%"; // Para que ocupe todo el espacio
        mensaje.style.marginTop = "20px";
        mensaje.style.color = "gray";
        
        grid.appendChild(mensaje);
        return; // Detenemos la función aquí
    }

    lista.forEach(perfil => {
        const card = document.createElement("a");
        card.className = "student-card";

        card.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = `profile.html?lang=${lang}&ci=${perfil.ci}`;
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

document.getElementById("input-busqueda").addEventListener("input", function(e) {
    const textoBuscado = e.target.value.toLowerCase();
    
    // Filtramos la lista original 'profiles'
    const perfilesFiltrados = profiles.filter(perfil => 
        perfil.name.toLowerCase().includes(textoBuscado)
    );
    
    // Volvemos a pintar las tarjetas pero solo con los que coinciden
    cargarPerfiles(perfilesFiltrados);
});

const urlParams = new URLSearchParams(window.location.search);
let lang = urlParams.get('lang') || 'ES';

const scriptConfig = document.createElement("script");
scriptConfig.src = `conf/config${lang}.json`;

scriptConfig.onload = function () {
    initConfig();
    
    // Verificamos si alguien llegó desde profile.html buscando algo
    const querySearch = urlParams.get('search');
    if (querySearch) {
        // Ponemos el texto en el input
        document.getElementById("input-busqueda").value = querySearch;
        // Filtramos la lista y cargamos
        const perfilesFiltrados = profiles.filter(perfil => 
            perfil.name.toLowerCase().includes(querySearch.toLowerCase())
        );
        cargarPerfiles(perfilesFiltrados);
    } else {
        // Si no buscaron nada, cargamos todos
        cargarPerfiles();
    }
};
document.head.appendChild(scriptConfig);

// === LÓGICA DEL MENÚ DESPLEGABLE EN MÓVILES (PASO 12) ===
const btnMenu = document.getElementById("icono-menu");
if (btnMenu) {
    btnMenu.addEventListener("click", function() {
        document.querySelector("header").classList.toggle("menu-abierto");
    });
}

