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

    const idUsuarioURL = params.get('id_usuario');
    const idPedidoURL = params.get('id_pedido');
    const origen = params.get('origen') || 'tactil';

    // Guardar datos en memoria global y sessionStorage
    if (idUsuarioURL) {
        window.idUsuario = idUsuarioURL;
        sessionStorage.setItem('id_usuario', idUsuarioURL);
    }

    if (idPedidoURL) {
        window.idPedido = idPedidoURL;
        sessionStorage.setItem('id_pedido', idPedidoURL);
    }

    // Cargar avatar y decidir flujo según la ruta
    cargarAvatarDesdeArchivo(urlAvatar, () => {
        if (ruta.includes('/usuarios')) {
            flujoRegistroUsuario();

        } else if (ruta.includes('/pedidos') && idUsuarioURL) {
            if (origen === 'voz') {
                flujoPedidoConUsuario(idUsuarioURL);
            }

        } else if (ruta.includes('/pedidos')) {
            flujoPedidoSinUsuario();

        } else if (ruta.includes('/detalle_pedido') && idUsuarioURL && idPedidoURL) {
            if (origen === 'voz') {
                flujoDetallePedidoConUsuarioConPedido(idUsuarioURL, idPedidoURL);
            }

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
        registrarUPedido(idUsuario);  // ira al paso 3 automaticamente
    });
}

function flujoPedidoSinUsuario() {
    hablar("Por favor, dime tu nombre para comenzar a registrar tu pedido.", () => {
        escuchar(1);
    });
}

function flujoDetallePedidoConUsuarioConPedido(idUsuario, idPedido) {
    // Guardar en memoria global y sessionStorage
    window.idUsuario = idUsuario;
    window.idPedido = idPedido;
    sessionStorage.setItem('id_usuario', idUsuario);
    sessionStorage.setItem('id_pedido', idPedido);

    hablar("Ahora te muestro los platos disponibles. Indícame el número del plato que deseas.", () => {
        escuchar(3); // Paso 3: selección de ítems
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

