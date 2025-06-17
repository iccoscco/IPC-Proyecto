function filtrarPedidos() {
    const idUsuario = document.getElementById('id_usuario').value;
    window.location.href = `/pedidos?id_usuario=${idUsuario}`;
}