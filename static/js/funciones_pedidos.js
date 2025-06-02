function filtrarPedidos() {
    const selected = document.getElementById('id_usuario').value;
    window.location.href = '/pedidos?id_usuario=' + selected;
}