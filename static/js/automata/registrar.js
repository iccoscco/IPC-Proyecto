import { hablar } from './voz.js';

export function registrarUsuario(nombre, correo) {
    fetch('/guardar_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}&id_rol=3`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) throw new Error("Error en el registro");

        const idUsuario = data.id_usuario;
        hablar(`${nombre}, ahora registraré tu pedido. Verás en la pantalla tu número de pedido.`, () => {
            registrarPedido(idUsuario);
        });
    })
    .catch(error => {
        console.error(error);
        hablar("Lo siento, ocurrió un problema al registrarte.");
    });
}

function registrarPedido(id_usuario) {
    fetch('/guardar_pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id_usuario=${encodeURIComponent(id_usuario)}&estado=pendiente&origen=voz`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) throw new Error("Error al registrar pedido");

        const idPedido = data.id_pedido;
        hablar(`Tu pedido fue registrado exitosamente. Puedes verlo ahora.`, () => {
            // 👇 Redirigir a la página que muestra los pedidos
            window.location.href = `/pedidos?id_usuario=${id_usuario}`;
        });
    })
    .catch(error => {
        console.error(error);
        hablar("Ocurrió un error al registrar el pedido.");
    });
}

