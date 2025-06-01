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
            console.log("Usuario registrado exitosamente.");
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
    chat.scrollTop = chat.scrollHeight; // Scroll automático
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
    const boca = document.getElementById('mouth');
    if (!boca) return;

    const formas = [
        "M90 180 Q130 200 170 180",  // forma original
        "M90 180 Q130 210 170 180",  // forma abierta
        "M90 180 Q130 195 170 180",  // forma semi abierta
    ];

    let i = 0;
    intervaloBoca = setInterval(() => {
        boca.setAttribute('d', formas[i % formas.length]);
        i++;
    }, 200); // cambia cada 200 ms
}

function detenerBoca() {
    clearInterval(intervaloBoca);
    const boca = document.getElementById('mouth');
    if (boca) boca.setAttribute('d', "M90 180 Q130 200 170 180");  // forma neutral
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
