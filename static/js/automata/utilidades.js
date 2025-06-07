export function mostrarEnChat(texto, emisor = 'sistema') {
    const chat = document.getElementById('chat');
    const p = document.createElement('p');
    p.innerHTML = `<strong>${emisor === 'usuario' ? '🧍 Usuario:' : '🤖 Sistema:'}</strong> ${texto}`;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}

export function mostrarDebug(mensaje) {
    const debug = document.getElementById('debug');
    const p = document.createElement('p');
    p.textContent = mensaje;
    debug.appendChild(p);
    debug.scrollTop = debug.scrollHeight;
}

export function cargarAvatarDesdeArchivo(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(svgText => {
            document.getElementById("avatar-container").innerHTML = svgText;
            callback();
        });
}


