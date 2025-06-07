import { moverBoca, detenerBoca } from './animacionBoca.js';
import { mostrarEnChat } from './utilidades.js';
import { procesarRespuesta } from './procesamiento.js';

export function hablar(texto, callback = null) {
    mostrarEnChat(texto, 'sistema');

    const sintesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';

    utterance.onstart = moverBoca;
    utterance.onend = () => {
        detenerBoca();
        if (callback) setTimeout(callback, 500);
    };

    sintesis.speak(utterance);
}

export function escuchar() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Tu navegador no soporta reconocimiento de voz.");
        return;
    }

    const reconocimiento = new webkitSpeechRecognition();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;
    reconocimiento.continuous = false;

    let tiempoMaximo = 10000;

    let temporizador = setTimeout(() => {
        reconocimiento.stop();
        hablar("No escuché nada. ¿Podrías repetir, por favor}?", escuchar);
    }, tiempoMaximo);

    reconocimiento.onresult = function(event) {
        clearTimeout(temporizador);
        const texto = event.results[0][0].transcript;
        mostrarEnChat(texto, 'usuario');
        reconocimiento.stop();
        procesarRespuesta(texto);
    };

    reconocimiento.onerror = function(event) {
        clearTimeout(temporizador);
        console.error("Error de reconocimiento:", event.error);
        hablar("Ocurrió un error al reconocer tu voz. Intenta nuevamente.", escuchar);
    };

    reconocimiento.start();
}

