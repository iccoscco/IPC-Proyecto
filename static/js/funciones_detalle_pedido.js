function agregarFila() {
    const contenedor = document.getElementById('menu-container');
    const nuevo = contenedor.children[0].cloneNode(true);
    // Reiniciar valores
    nuevo.querySelector('select').selectedIndex = 0;
    nuevo.querySelector('input').value = 1;
    contenedor.appendChild(nuevo);
}

document.addEventListener('DOMContentLoaded', () => {
    const usuarioSelect = document.getElementById('usuario');
    const pedidoSelect = document.getElementById('id_pedido');

    usuarioSelect.addEventListener('change', () => {
        const usuarioId = usuarioSelect.value;

        if (!usuarioId) return;

        fetch(`/pedidos_por_usuario?usuario_id=${usuarioId}`)
            .then(response => response.json())
            .then(pedidos => {
                // Limpiar opciones anteriores
                pedidoSelect.innerHTML = '<option value="" disabled selected>-- Seleccione pedido --</option>';

                if (pedidos.length === 0) {
                    const option = document.createElement('option');
                    option.disabled = true;
                    option.textContent = 'No hay pedidos pendientes';
                    pedidoSelect.appendChild(option);
                } else {
                    pedidos.forEach(pedido => {
                        const option = document.createElement('option');
                        option.value = pedido.id;
                        option.textContent = `Pedido #${pedido.id}`;
                        pedidoSelect.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error('Error al obtener pedidos:', error);
            });
    });
});

