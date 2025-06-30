// Mostrar el menú-catalogo2 si origen=voz
const params = new URLSearchParams(window.location.search);
const origen = params.get('origen');

if (origen === 'voz') {
    document.getElementById('menu-catalogo2').style.display = 'grid';
} else {
    document.getElementById('menu-catalogo2').style.display = 'none';
}

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

function mostrarCatalogo() {
    document.getElementById('menu-catalogo').style.display = 'grid';
}

function ocultarCatalogo() {
    document.getElementById('menu-catalogo').style.display = 'none';
}

function agregarItem(idMenu, nombreMenu) {
    const container = document.getElementById('menu-container');
    const existente = container.querySelector(`tr[data-id='${idMenu}']`);

    if (existente) {
        const cantidadInput = existente.querySelector('input[name="cantidad[]"]');
        cantidadInput.value = parseInt(cantidadInput.value) + 1;
    } else {
        const fila = document.createElement('tr');
        fila.classList.add('menu-item');
        fila.setAttribute('data-id', idMenu);

        fila.innerHTML = `
            <td>
                <div class="menu-id-circulo">${idMenu}</div>
                <input type="hidden" name="id_menu[]" value="${idMenu}">
            </td>
            <td>${nombreMenu}</td>
            <td>
                <input type="number" name="cantidad[]" min="1" value="1" required>
            </td>
            <td>
                <button type="button" onclick="eliminarItem(this)" title="Eliminar">
                    🗑️
                </button>
            </td>
        `;

        container.appendChild(fila);
    }

    ocultarCatalogo();
}

function eliminarItem(boton) {
    const fila = boton.closest('tr');
    fila.remove();
}

window.agregarItemDesdeVoz = function(idMenu, nombreMenu, cantidad = 1) {
    const container = document.getElementById('menu-container');
    const existente = container.querySelector(`[data-id='${idMenu}']`);

    if (existente) {
        const cantidadInput = existente.querySelector('input[name="cantidad[]"]');
        cantidadInput.value = parseInt(cantidadInput.value) + cantidad;
    } else {
        const fila = document.createElement('tr');
        fila.classList.add('menu-item');
        fila.setAttribute('data-id', idMenu);

        fila.innerHTML = `
            <td>
                <div class="menu-id-circulo">${idMenu}</div>
                <input type="hidden" name="id_menu[]" value="${idMenu}">
            </td>
            <td>${nombreMenu}</td>
            <td>
                <input type="number" name="cantidad[]" min="1" value="1" required>
            </td>
            <td>
                <button type="button" onclick="eliminarItem(this)" title="Eliminar">
                    🗑️
                </button>
            </td>
        `;

        container.appendChild(fila);
    }
};

function resaltarItem(idMenu) {
    const card = document.querySelector(`.menu-card[onclick*="${idMenu}"]`);
    if (card) {
        card.style.boxShadow = "0 0 10px 3px #00ff00";
        setTimeout(() => {
            card.style.boxShadow = "";
        }, 500);
    }
}
