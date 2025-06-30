import { hablar, escuchar } from './voz.js';
import { esNombreValido, extraerNombre } from './validacion.js';
import { mostrarDebug, mostrarEnChat } from './utilidades.js';
import { registrarUsuario, registrarUPedido, registrarUDetallePedido, idPedido } from './registrar.js';

let nombreUsuario = '';
let correoUsuario = '';
let detalleItems = [];

const mapaNumeros = {
    "uno": 1, "una": 1,
    "dos": 2,
    "tres": 3,
    "cuatro": 4,
    "cinco": 5,
    "seis": 6,
    "siete": 7,
    "ocho": 8,
    "nueve": 9,
    "diez": 10,
    "once": 11,
    "doce": 12
};

function limpiarTexto(texto) {
    return texto
        .toLowerCase()
        .replace(/\s+/g, '')        // Quitar espacios
        .replace(/\.$/, '')         // Quitar punto final
        .replace(/arroba/g, '@')    // Convertir 'arroba' en '@'
        .replace(/punto/g, '.')     // Convertir 'punto' en '.'
        .replace(/coma/g, '.')      // Por si dice 'coma' en lugar de 'punto'
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ''); // Quitar tildes
}

  
function convertirTextoANumero(texto) {
    texto = limpiarTexto(texto);
    if (!isNaN(texto)) return parseInt(texto); 
    return mapaNumeros[texto] || NaN;
}


export function procesarRespuesta(texto, pasoActual) {
    mostrarDebug("Texto reconocido: " + texto);

    if (pasoActual === 1) {
        const nombreExtraido = extraerNombre(limpiarTexto(texto));
        mostrarDebug("Nombre extraído: " + nombreExtraido);

        if (!esNombreValido(nombreExtraido)) {
            hablar("No entendí bien tu nombre. ¿Podrías repetirlo?", () => escuchar(1));
            return;
        }

        nombreUsuario = nombreExtraido;
        mostrarEnChat(`(Interpretado como: ${nombreUsuario})`, 'sistema');
        hablar(`Gracias ${nombreUsuario}. Ahora dime tu correo electrónico.`, () => {
            escuchar(2);
        });

    } else if (pasoActual === 2) {
        correoUsuario = limpiarTexto(texto).replace(/\s+/g, '');
        mostrarDebug("Correo limpio: " + correoUsuario);
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoUsuario);

        if (!correoValido) {
            hablar("Eso no parece un correo válido. Repite por favor.", () => escuchar(2));
            return;
        }

        mostrarEnChat(`(Correo recibido: ${correoUsuario})`, 'sistema');
        hablar(`Dame un momento te estoy registrando como cliente.`, () => {
            registrarUsuario(nombreUsuario, correoUsuario);
        });

    } else if (pasoActual === 3) {
        const textoLimpio = limpiarTexto(texto);
    
        if (textoLimpio.includes("no")) {
            if (idPedido || window.idPedido) {
                registrarUDetallePedido(idPedido || window.idPedido, detalleItems);
            } else {
                hablar("No encontré un pedido activo para guardar los ítems. Por favor vuelve a la opcion registrar pedido");
            }

            window.idTemporal = null;
            window.estadoPedido = 'esperando_id';
            return;
        }
    
        if (!window.estadoPedido || window.estadoPedido === 'esperando_id') {
            const id_menu = convertirTextoANumero(texto);
            if (!isNaN(id_menu)) {
                window.idTemporal = id_menu;
                window.estadoPedido = 'esperando_cantidad';
                mostrarEnChat(`Plato ${id_menu} seleccionado.`, 'sistema');
                hablar("¿Cuántas unidades deseas?", () => escuchar(3));
            } else {
                window.idTemporal = null;
                window.estadoPedido = 'esperando_id';
                hablar("No entendí el número del ítem. Por favor, repítelo.", () => escuchar(3));
            }
    
        } else if (window.estadoPedido === 'esperando_cantidad') {
            const cantidad = convertirTextoANumero(texto);
            if (!isNaN(cantidad) && cantidad > 0) {
                const existente = detalleItems.find(item => item.id_menu === window.idTemporal);
                if (existente) {
                    existente.cantidad += cantidad;
                } else {
                    detalleItems.push({ id_menu: window.idTemporal, cantidad });
                }
    
                

                const itemSeleccionado = window.menuCompleto.find(item => item.id == window.idTemporal);
                if (itemSeleccionado) {
                    agregarItemDesdeVoz(itemSeleccionado.id, itemSeleccionado.nombre, cantidad);
                    resaltarItem(itemSeleccionado.id);
                    mostrarEnChat(`Plato ${window.idTemporal} agregado con ${cantidad} unidad(es).`, 'sistema');
                }
    
                window.idTemporal = null;
                window.estadoPedido = 'esperando_id';
    
                hablar("¿Deseas agregar otro ítem? Dime el número o di no.", () => escuchar(3));
 
            } else {
                window.idTemporal = null;
                window.estadoPedido = 'esperando_id';
                hablar("No entendí la cantidad. Por favor, dime cuántas unidades deseas.", () => escuchar(3));
            }
        }
    }
    
}

export function procesarRespuesta2(texto, contexto) {
    const textoLimpio = limpiarTexto(texto);
    mostrarDebug("Respuesta2 reconocida: " + textoLimpio);

    const { idUsuario, tienePedidos, pedidos } = contexto;

    if (!tienePedidos) {
        if (textoLimpio.includes("sí") || textoLimpio.includes("claro")) {
            window.location.href = `/pedidos?id_usuario=${idUsuario}`;
        } else if (textoLimpio.includes("no")) {
            hablar("Entendido. No se registrará un nuevo pedido.");
        } else {
            hablar("¿Deseas registrar un nuevo pedido? Por favor, responde sí o no.", () => {
                escuchar(100, (texto) => procesarRespuesta2(texto, contexto));
            });
        }
    } else {
        const numero = convertirTextoANumero(textoLimpio);
        const pedidoSeleccionado = pedidos.find(p => p.id === numero);

        if (pedidoSeleccionado) {
            document.getElementById('id_pedido').value = pedidoSeleccionado.id;
            window.idPedido = pedidoSeleccionado.id;
            hablar(`Perfecto. Usaremos el pedido número ${pedidoSeleccionado.id}. Puedes empezar a registrar platos.`, () => {
                escuchar(3);
            });
        } else {
            hablar("No entendí el número del pedido. Por favor, dime el número correcto.", () => {
                escuchar(100, (texto) => procesarRespuesta2(texto, contexto));
            });
        }
    }
}
