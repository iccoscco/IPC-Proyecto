import { hablar, escuchar } from './voz.js';
import { esNombreValido, extraerNombre } from './validacion.js';
import { mostrarDebug, mostrarEnChat } from './utilidades.js';
import { registrarUsuario } from './registrar.js';

let nombreUsuario = '';
let correoUsuario = '';
let paso = 1;

export function procesarRespuesta(texto) {
    mostrarDebug("Texto reconocido: " + texto);

    if (paso === 1) {
        const nombreExtraido = extraerNombre(texto);
        mostrarDebug("Nombre extraído: " + nombreExtraido);

        if (!esNombreValido(nombreExtraido)) {
            hablar("No entendí bien tu nombre. ¿Podrías repetirlo?", escuchar);
            return;
        }

        nombreUsuario = nombreExtraido;
        mostrarEnChat(`(Interpretado como: ${nombreUsuario})`, 'sistema');
        hablar(`Gracias ${nombreUsuario}. Ahora dime tu correo electrónico.`, () => {
            paso = 2;
            escuchar();
        });

    } else if (paso === 2) {
        correoUsuario = texto.replace(/\s+/g, '').toLowerCase();
        mostrarDebug("Correo limpio: " + correoUsuario);

        const correoValido = correoUsuario.includes('@') && correoUsuario.includes('.');

        if (!correoValido) {
            hablar("Eso no parece un correo válido. Repite por favor.", escuchar);
            return;
        }

        mostrarEnChat(`(Correo recibido: ${correoUsuario})`, 'sistema');
        hablar(`Perfecto. Te he registrado como cliente.`, () => {
            registrarUsuario(nombreUsuario, correoUsuario);
            paso = 1;
        });
    }
}


