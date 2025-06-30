function filtrarPedidos() {
    const idUsuario = document.getElementById('id_usuario').value;
    window.location.href = `/pedidos?id_usuario=${idUsuario}`;
}

const params = new URLSearchParams(window.location.search);
const origen = params.get('origen') || 'tactil';  // Por defecto 'tactil' si no hay

document.getElementById('origen_mostrado').value = origen;
document.getElementById('origen').value = origen;