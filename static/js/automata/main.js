import { hablar } from './voz.js';
import { escuchar } from './voz.js';
import { cargarAvatarDesdeArchivo } from './utilidades.js';

export function iniciarAutomata() {
    const url = '/static/avatars/avatar.svg?t=' + new Date().getTime();
    cargarAvatarDesdeArchivo(url, () => {
        hablar("Bienvenido al restaurante. Hoy día tendré el placer de atenderte. Primero registraré tu nombre. ¿Me podrías indicar tu nombre?", () => {
            escuchar();
        });
    });
}


let menuSeleccionado = [];

function iniciarDialogoMenu() {
    hablar("Ahora te mostraré el menú disponible. Verás una tabla con los platos y sus IDs.", () => {
        setTimeout(preguntarMenu, 2000); // Esperar a que el usuario vea la tabla
    });
}

function preguntarMenu() {
    hablar("¿Qué número de menú deseas pedir?", () => {
        escuchar((respuesta) => {
            const idMenu = parseInt(respuesta);
            if (!isNaN(idMenu)) {
                menuSeleccionado.push(idMenu);
                preguntarAgregarOtro();
            } else {
                hablar("No entendí el número. Por favor, di solo el número del menú.", preguntarMenu);
            }
        });
    });
}

function preguntarAgregarOtro() {
    hablar("¿Deseas agregar otro plato?", () => {
        escuchar((respuesta) => {
            if (respuesta.toLowerCase().includes("sí")) {
                preguntarMenu();
            } else {
                hablar("Perfecto, te redirigiré para completar tu pedido.", () => {
                    sessionStorage.setItem('menu_seleccionado', JSON.stringify(menuSeleccionado));
                    window.location.href = '/detalle_pedido';
                });
            }
        });
    });
}

// Ejecutar solo si estamos en pedidos con ?id_usuario
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id_usuario")) {
        iniciarDialogoMenu();
    }
});
