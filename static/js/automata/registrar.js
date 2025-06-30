import { hablar, escuchar } from './voz.js';

export let idUsuario = null;
export let idPedido = null;

// Registrar nuevo usuario
export function registrarUsuario(nombre, correo) {
    fetch('/guardar_usuario', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'  
        },
        body: `nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}&id_rol=1`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) throw new Error("Error en el registro");

        idUsuario = data.id_usuario;
        window.idUsuario = data.id_usuario;
        hablar(`Te confirmo que te registré como cliente, ${nombre}. Ahora ingresaré tu pedido.`, () => {
            window.location.href = `/pedidos?id_usuario=${idUsuario}&origen=voz`;
        });
    })
    .catch(error => {
        console.error(error);
        hablar("Lo siento, ocurrió un problema al registrarte. " + error.message);
    });
}


// Registrar un nuevo pedido
export function registrarUPedido(id_usuario, origen = 'voz') {
    idUsuario = id_usuario;
    window.idUsuario = id_usuario;
    sessionStorage.setItem('id_usuario', id_usuario); 

    // Limpiar selección previa
    sessionStorage.removeItem('menu_seleccionado');

    fetch('/guardar_pedido', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'  
        },
        body: `id_usuario=${encodeURIComponent(id_usuario)}&estado=pendiente&origen=${encodeURIComponent(origen)}`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) throw new Error("Error al registrar pedido");

        idPedido = data.id_pedido;
        window.idPedido = data.id_pedido;
        sessionStorage.setItem('id_pedido', data.id_pedido);
        hablar(`Tu número de pedido es ${idPedido}.`, () => {
            window.location.href = `/detalle_pedido?id_usuario=${idUsuario}&id_pedido=${idPedido}&origen=voz`;
        });
    })
    .catch(error => {
        console.error(error);
        hablar("Ocurrió un error al registrar el pedido." + error.message);
    });
}


// Registrar los detalles del pedido (items del menu
export function registrarUDetallePedido(id_pedido, detalleItems) {
    if (!Array.isArray(detalleItems) || detalleItems.length === 0) {
        hablar("No se encontró ningún plato seleccionado.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append('id_pedido', id_pedido);

    detalleItems.forEach(item => {
        const id = parseInt(item.id_menu);
        const cantidad = parseInt(item.cantidad);

        if (!isNaN(id) && id > 0 && !isNaN(cantidad) && cantidad > 0) {
            formData.append('id_menu[]', id);
            formData.append('cantidad[]', cantidad);
        }
    });

    console.log("🧾 Enviando detalle:", formData.toString());

    fetch('/guardar_detalles_pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(response => {
        if (!response.ok) throw new Error("No se pudo guardar el detalle del pedido.");

        const idFinal = window.idUsuario || sessionStorage.getItem('id_usuario');
        hablar("Tus platos fueron registrados correctamente. Gracias por tu pedido.", () => {
            window.location.href = `/vista_pedido?id_usuario=${idFinal}`;
        });

    })
    .catch(error => {
        console.error("Error al registrar los detalles del pedido:", error);
        hablar("Ocurrió un error al guardar los platos del pedido.");
    });
}


