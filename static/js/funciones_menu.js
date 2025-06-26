function mostrarVistaPrevia(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
    }
}

document.querySelectorAll('.input-imagen').forEach(function(input) {
    input.addEventListener('change', function(event) {
      const contenedor = event.target.closest('.contenedor-subida');
      const nombreArchivo = contenedor.querySelector('.nombre-archivo');
      nombreArchivo.textContent = event.target.files[0]?.name || "Ningún archivo seleccionado";
    });
  });