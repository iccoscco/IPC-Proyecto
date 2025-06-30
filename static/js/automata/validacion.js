export function esNombreValido(textoLimpio) {
    const limpio = textoLimpio.replace(/[.,!?¡¿"]/g, '').trim();
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio) && limpio.length >= 3;
}

export function extraerNombre(texto) {
    const frases = ["me llamo", "mi nombre es", "soy", "eh", "hola", "yo soy", "me dicen", "que tal"];
    let nombre = texto.toLowerCase();

    for (let frase of frases) {
        if (nombre.startsWith(frase)) {
            nombre = nombre.replace(frase, '').trim();
            break;
        }
    }

    return nombre
        .split(" ")
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}

export function limpiarTexto(texto) {
    return texto
        .toLowerCase()
        .replace(/\s+/g, '')        // Quitar espacios
        .replace(/\.$/, '')         // Quitar punto final
        .replace(/arroba/g, '@')    // Convertir 'arroba' en '@'
        .replace(/punto/g, '.')     // Convertir 'punto' en '.'
        .replace(/coma/g, '.')      // Por si dice 'coma' en lugar de 'punto'
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ''); // Quitar tildes
}

export function limpiarTexto2(texto) {
    return texto
        .toLowerCase()
        .replace(/\.$/, '')         // Quitar punto final
        .replace(/arroba/g, '@')    // Convertir 'arroba' en '@'
        .replace(/punto/g, '.')     // Convertir 'punto' en '.'
        .replace(/coma/g, '.')      // Por si dice 'coma' en lugar de 'punto'
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ''); // Quitar tildes
}