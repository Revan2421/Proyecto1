console.log("[this #1 - Global scope]:", this);

function initConfig() {
    document.getElementById("titulo-ATI").innerHTML = config.site[0] + "<span class=\"logo-sub\">" + config.site[1] + "</span>" + config.site[2];
    document.getElementById("input-busqueda").placeholder = config.name + "...";
    document.getElementById("btn-busqueda").textContent = config.search;
    document.getElementById("label-perfil").textContent = config.profile;
    document.getElementById("copyright").textContent = config.copyRight;
}

const urlParams = new URLSearchParams(window.location.search);
let lang = urlParams.get('lang') || 'ES';
const ci = urlParams.get('ci');

if (ci) {
    const scriptPerfil = document.createElement("script");
    scriptPerfil.src = `${ci}/profile.json`;

    scriptPerfil.onload = function () {
        const scriptConfig = document.createElement("script");
        scriptConfig.src = `conf/config${lang}.json`;

        scriptConfig.onload = function () {
            initConfig();
            cargarDatosPerfil();
        };
        document.head.appendChild(scriptConfig);
    };

    document.head.appendChild(scriptPerfil);
} else {
    document.querySelector(".main-content").innerHTML = "<h1>Error: No se ha seleccionado ningún perfil.</h1>";
}

function cargarDatosPerfil() {

    document.getElementById("foto-perfil").src = `${profile.ci}/${profile.ci}Big${profile.image_ext}`;
    document.getElementById("foto-perfil").alt = profile.name;

    document.getElementById("Nombre_persona").textContent = profile.name;
    document.getElementById("descripcion_value").textContent = profile.description;

    document.getElementById("Color_Fav").textContent = config.color;
    document.getElementById("Color_Value").textContent = profile.color;

    if (profile.book.length > 1) {
        document.getElementById("Libro_Fav").textContent = config.book[1];
    } else {
        document.getElementById("Libro_Fav").textContent = config.book[0];
    }
    document.getElementById("Libro_Value").textContent = profile.book.join(", ");

    if (profile.music.length > 1) {
        document.getElementById("Genero_Musica").textContent = config.music[1];
    } else {
        document.getElementById("Genero_Musica").textContent = config.music[0];
    }
    document.getElementById("Musica_Value").textContent = profile.music.join(", ");

    if (profile.video_game.length > 1) {
        document.getElementById("Game_Fav").textContent = config.video_game[1];
    } else {
        document.getElementById("Game_Fav").textContent = config.video_game[0];
    }
    document.getElementById("Game_value").textContent = profile.video_game.join(", ");

    document.getElementById("Lenguaje_Fav").textContent = config.language;
    document.getElementById("Lenguaje_Value").textContent = profile.language.join(", ");

    let textoDeCorreo = config.email.replace("[email]", "");
    document.getElementById("texto-correo").textContent = textoDeCorreo;

    const enlaceCorreo = document.getElementById("correo_value");
    enlaceCorreo.href = `mailto:${profile.email}`;
    enlaceCorreo.textContent = profile.email;
}

document.getElementById("btn-busqueda").addEventListener("click", function () {
    console.log("[this #3 - Event listener en btn-busqueda]:", this);
    ejecutarBusqueda();
});
document.getElementById("input-busqueda").addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        ejecutarBusqueda();
    }
});

function ejecutarBusqueda() {
    console.log("[this #2 - Función regular ejecutarBusqueda]:", this);
    const valorBusqueda = document.getElementById("input-busqueda").value;
    if (valorBusqueda.trim() !== "") {
        window.location.href = `index.html?lang=${lang}&search=${encodeURIComponent(valorBusqueda)}`;
    }
}

const btnMenu = document.getElementById("icono-menu");
if (btnMenu) {
    btnMenu.addEventListener("click", function () {
        document.querySelector("header").classList.toggle("menu-abierto");
    });
}