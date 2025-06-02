let nombreUsuario = '';
let correoUsuario = '';
let paso = 1;  // 1: pedir nombre, 2: pedir correo

function hablar(texto, callback = null) {
    mostrarEnChat(texto, 'sistema');  // 💬 mostrar lo que el bot dice

    const sintesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';

    utterance.onstart = () => {
        moverBoca(); // 🟢 Iniciar animación al comenzar a hablar
    };

    utterance.onend = () => {
        detenerBoca(); // 🔴 Detener animación al terminar de hablar
        if (callback) {
            setTimeout(callback, 500);  // Espera medio segundo antes de continuar
        }
    };

    sintesis.speak(utterance);
}

function escuchar() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Tu navegador no soporta reconocimiento de voz.");
        return;
    }

    const reconocimiento = new webkitSpeechRecognition();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;
    reconocimiento.continuous = false; // Puedes probar con true si quieres captar más pausas
    let tiempoMaximo = 10000; // 10 segundos máximos

    let temporizador = setTimeout(() => {
        reconocimiento.stop();  // Cortamos manualmente si tarda demasiado
        hablar("No escuché nada. ¿Podrías repetir, por favor?", () => {
            escuchar();
        });
    }, tiempoMaximo);

    reconocimiento.onresult = function(event) {
        clearTimeout(temporizador);  // Cancela el timeout si hubo respuesta
        const texto = event.results[0][0].transcript;
        mostrarEnChat(texto, 'usuario');
        reconocimiento.stop();
        procesarRespuesta(texto);
    };

    reconocimiento.onerror = function(event) {
        clearTimeout(temporizador);
        console.error("Error de reconocimiento de voz:", event.error);
        hablar("Ocurrió un error al reconocer tu voz. Por favor intenta nuevamente.", () => {
            escuchar();
        });
    };

    reconocimiento.start();
}


function esNombreValido(textoLimpio) {
    // Elimina puntos, comas, signos, etc. antes de validar
    const limpio = textoLimpio.replace(/[.,!?¡¿"]/g, '').trim();
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio) && limpio.length >= 3;
}

function extraerNombre(texto) {
    const frasesIntroductorias = [
        "me llamo", "mi nombre es", "soy", "eh", "hola", "yo soy", "me dicen"
    ];

    let nombre = texto.toLowerCase();

    for (let frase of frasesIntroductorias) {
        if (nombre.startsWith(frase)) {
            nombre = nombre.replace(frase, '').trim();
            break;
        }
    }

    // Capitalizar cada palabra del nombre
    nombre = nombre.split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

    return nombre;
}


function procesarRespuesta(texto) {
    mostrarDebug("Texto reconocido: " + texto);

    if (paso === 1) {
        const nombreExtraido = extraerNombre(texto);
        mostrarDebug("Nombre extraído: " + nombreExtraido);

        const valido = esNombreValido(nombreExtraido);
        mostrarDebug("¿Nombre válido?: " + valido);

        if (!valido) {
            hablar("No entendí bien tu nombre. ¿Podrías repetirlo por favor?", () => {
                escuchar();
            });
            return;
        }

        nombreUsuario = nombreExtraido;

        mostrarEnChat(`(Interpretado como: ${nombreUsuario})`, 'sistema');
        mostrarDebug("Nombre final registrado: " + nombreUsuario);

        hablar(`Gracias ${nombreUsuario}. Ahora por favor dime tu correo electrónico.`, () => {
            paso = 2;
            escuchar();
        });

    } else if (paso === 2) {
        correoUsuario = texto.replace(/\s+/g, '').toLowerCase();
        mostrarDebug("Correo recibido crudo: " + texto);
        mostrarDebug("Correo limpio: " + correoUsuario);

        const correoValido = correoUsuario.includes('@') && correoUsuario.includes('.');
        mostrarDebug("¿Correo válido?: " + correoValido);

        if (!correoValido) {
            hablar("Eso no parece un correo válido. Por favor, repite tu correo electrónico.", () => {
                escuchar();
            });
            return;
        }

        mostrarDebug("Correo final registrado: " + correoUsuario);

        mostrarEnChat(`(Correo recibido: ${correoUsuario})`, 'sistema');

        hablar(`Perfecto. Te he registrado como cliente.`, () => {
            registrarUsuario(nombreUsuario, correoUsuario);
            paso = 1;
        });
    }
}



function registrarUsuario(nombre, correo) {
    fetch('/guardar_usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}&id_rol=3`
    })
    .then(response => {
        if (response.ok) {
            console.log("Usuario registrado exitosamente. Ahora tomaré nota de tu pedido");
        } else {
            console.error("Error al registrar el usuario.");
            hablar("Lo siento, ocurrió un problema al registrarte.");
        }
    });
}

function iniciarAutomata() {
    const url = '/static/avatars/avatar.svg?t=' + new Date().getTime();
    cargarAvatarDesdeArchivo(url, () => {
        hablar("Bienvenido al restaurante. Hoy día tendré el placer de atenderte. Primero registraré tu nombre. ¿Me podrías indicar tu nombre?", () => {
            escuchar();
        });
    });
}

function mostrarEnChat(texto, emisor = 'sistema') {
    const chat = document.getElementById('chat');
    const p = document.createElement('p');
    p.innerHTML = `<strong>${emisor === 'usuario' ? '🧍 Usuario:' : '🤖 Sistema:'}</strong> ${texto}`;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight; // Scroll automatico
}

function mostrarDebug(mensaje) {
    const debug = document.getElementById('debug');
    const p = document.createElement('p');
    p.textContent = mensaje;
    debug.appendChild(p);
    debug.scrollTop = debug.scrollHeight;
}

let intervaloBoca;

function moverBoca() {
    const labios = document.getElementById('lips');
    const boca = document.getElementById('mouth');
    if (!labios || !boca) return;

    const formasLabios = [
        // Labios cerrados
        "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103 177 C 116 182 122 182 127 182 C 133 183 137 182 146 181 C 148 181 155 180 163 177 C 154 186 152 185 146 186 C 137 187 132 189 116 185 Z",
        // Semi abiertos
        "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103.8 183.2 C 111.5 190.2 118.5 189.5 122.7 189.5 C 137.4 189.5 140.2 188.8 146.5 188.1 C 151.4 186 154.9 185.3 161.2 181.1 C 153.5 189.5 150.7 192.3 146.5 194.4 C 140.2 198.6 123.4 199.3 112.9 193 Z",
        // Abiertos
        "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103.8 183.2 C 111.5 190.2 115 193 118 194 C 125 196 135 197 146 193 C 152 190 154.9 185.3 158 185 C 153.5 189.5 153 194 146 197 C 140.2 198.6 123 202 112 194 Z"
    ];

    const formasBoca = [
        "M 114 179 C 127 180 134 181 160 177 C 160 179 145 182 131 182 C 126 182 110 181 106 177 Z", // Cerrado: sin espacio interno
        "M 103 176 Q 122 184 165 176 C 153 185 155 186 131 186 C 112 186 109.33 182.6 107 182 Z", // Semiabierto
        "M 103 176 Q 122 184 165 176 C 148 192 147 193 139 195 C 117 198 111 189 107 185 Z"  // Abierto
    ];

    let i = 0;
    clearInterval(intervaloBoca);
    intervaloBoca = setInterval(() => {
        labios.setAttribute('d', formasLabios[i % formasLabios.length]);
        boca.setAttribute('d', formasBoca[i % formasBoca.length]);
        i++;
    }, 200);
}


function detenerBoca() {
    clearInterval(intervaloBoca);
    const boca = document.getElementById('mouth');
    const labios = document.getElementById('lips');
    // Cerrado: sin espacio interno
    if (labios) {
        labios.setAttribute('d', "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103 177 C 116 182 122 182 127 182 C 133 183 137 182 146 181 C 148 181 155 180 163 177 C 154 186 152 185 146 186 C 137 187 132 189 116 185 Z");
    }
    if (boca) {
        boca.setAttribute('d', "M 114 179 C 127 180 134 181 160 177 C 160 179 145 182 131 182 C 126 182 110 181 106 177 Z"); 
    }
}

function cargarAvatarDesdeArchivo(url, callback = null) {
    fetch(url)
        .then(response => response.text())
        .then(svgTexto => {
            const container = document.getElementById('avatar-container');
            container.innerHTML = svgTexto;

            if (callback) callback();
        })
        .catch(error => {
            console.error("Error al cargar el avatar SVG:", error);
        });
}
