export function esNombreValido(textoLimpio) {
    const limpio = textoLimpio.replace(/[.,!?¡¿"]/g, '').trim();
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio) && limpio.length >= 3;
}

export function extraerNombre(texto) {
    const frases = ["me llamo", "mi nombre es", "soy", "eh", "hola", "yo soy", "me dicen"];
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

