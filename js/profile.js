// 1. Reutilizamos la función para cargar cabecera y pie de página (igual a index.js)
function initConfig() {
    document.getElementById("titulo-ATI").innerHTML = config.site[0] + "<span>" + config.site[1] + "</span>" + config.site[2];
    document.getElementById("input-busqueda").placeholder = config.name + "...";
    document.getElementById("btn-busqueda").textContent = config.search;
    document.getElementById("copyright").textContent = config.copyRight;
}

const urlParams = new URLSearchParams(window.location.search);
const ci = urlParams.get('ci');

if (ci) {
    const scriptPerfil = document.createElement("script");
    scriptPerfil.src = `${ci}/profile.json`;

    scriptPerfil.onload = function () {
        initConfig();
        cargarDatosPerfil();
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
