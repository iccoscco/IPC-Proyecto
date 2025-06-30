function abrirModalAgregar(idPedido, idMenu, nombreMenu) {
    document.getElementById('modal-id-pedido').value = idPedido;
    document.getElementById('modal-id-menu').value = idMenu;
    document.getElementById('modal-menu-nombre').innerText = `Plato: ${nombreMenu}`;
    document.getElementById('cantidad').value = 1;

    document.getElementById('modalAgregar').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalAgregar').style.display = 'none';
}

// Cerrar modal si hacen clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('modalAgregar');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function mostrarMenu(pedidoId) {
    const menu = document.getElementById(`menu-${pedidoId}`);
    menu.style.display = menu.style.display === 'none' ? 'grid' : 'none';
}

function mostrarEliminarItems(pedidoId) {
    const tabla = document.getElementById(`eliminar-items-${pedidoId}`);
    tabla.style.display = tabla.style.display === 'none' ? 'block' : 'none';
}

function cancelarPedido(pedidoId) {
    if (confirm("¿Estás seguro de cancelar este pedido?")) {
        fetch(`/cancelar_pedido/${pedidoId}`, { method: 'POST' })
        .then(res => {
            if (res.ok) {
                alert('Pedido cancelado.');
                location.reload();
            } else {
                alert('Error al cancelar el pedido');
            }
        });
    }
}

function eliminarItem(pedidoId, idMenu) {
    if (confirm("¿Seguro que quieres eliminar este ítem del pedido?")) {
        fetch(`/vista_pedido/eliminar_item/${pedidoId}/${idMenu}`, { method: 'POST' })
        .then(res => {
            if (res.ok) {
                alert('Ítem eliminado');
                location.reload();
            } else {
                alert('Error al eliminar ítem');
            }
        });
    }
}

