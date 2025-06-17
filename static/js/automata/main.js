import { hablar } from './voz.js';
import { escuchar } from './voz.js';
import { cargarAvatarDesdeArchivo } from './utilidades.js';
import { registrarUPedido, idPedido } from './registrar.js';
import { procesarRespuesta2 } from './procesamiento.js';

// Flujo dinámico basado en la ruta y parámetros
export function iniciarAutomata() {
    const urlAvatar = '/static/avatars/avatar.svg?t=' + new Date().getTime();
    const ruta = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const idUsuario = params.get('id_usuario');

    // Cargar avatar primero
    cargarAvatarDesdeArchivo(urlAvatar, () => {
        if (ruta.includes('/usuarios')) {
            flujoRegistroUsuario();
        } else if (ruta.includes('/pedidos') && idUsuario) {
            flujoPedidoConUsuario(idUsuario);
        } else if (ruta.includes('/pedidos')) {
            flujoPedidoSinUsuario();
        } else if (ruta.includes('/detalle_pedido')) {
            flujoDetallePedidoDirecto();
        } else {
            hablar("No sé en qué parte del sistema estás. Contacta con un administrador.");
        }
    });
}

function flujoRegistroUsuario() {
    hablar("Bienvenido al restaurante. Hoy día tendré el placer de atenderte. Primero registraré tu nombre. ¿Me podrías indicar tu nombre?", () => {
        escuchar(1);
    });
}

function flujoPedidoConUsuario(idUsuario) {
    // Continuar con el pedido directamente
    hablar("Procederé a registrar tu pedido.", () => {
        registrarUPedido(idUsuario);  // irá al paso 3 automáticamente
    });
}

function flujoPedidoSinUsuario() {
    hablar("Por favor, dime tu nombre para comenzar a registrar tu pedido.", () => {
        escuchar(1);
    });
}

function flujoDetallePedidoDirecto() {
    const selectUsuario = document.getElementById("usuario");
    const selectPedidos = document.getElementById("id_pedido");

    hablar("Por favor, selecciona tu nombre del listado.");

    selectUsuario.addEventListener("change", async () => {
        const idUsuario = selectUsuario.value;
        if (!idUsuario) return;

        window.idUsuario = idUsuario; 

        hablar("Espera un momento, vamos a ver si tienes pedidos ingresados.");

        const response = await fetch(`/pedidos_usuario/${idUsuario}`);
        const data = await response.json();
        const pedidos = data.pedidos || [];

        // Limpiar select
        selectPedidos.innerHTML = `<option value="" disabled selected>-- Seleccione pedido --</option>`;
        pedidos.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `Pedido #${p.id}`;
            selectPedidos.appendChild(opt);
        });

        const tienePedidos = pedidos.length > 0;

        if (!tienePedidos) {
            hablar("Aún no tienes pedidos. ¿Deseas registrar uno?", () => {
                escuchar(100, (texto) => procesarRespuesta2(texto, { idUsuario, tienePedidos }));
            });
        } else {
            hablar(`Tienes ${pedidos.length} pedidos. ¿Cuál deseas usar para registrar platos?`, () => {
                escuchar(100, (texto) => procesarRespuesta2(texto, { idUsuario, tienePedidos, pedidos }));
            });
        }
    });
}

