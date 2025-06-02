document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('avatar');

    function createEye(idPrefix, cx, cy) {
        let eyeGroup = document.getElementById(idPrefix + '-group');
        if (!eyeGroup) {
            eyeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            eyeGroup.id = idPrefix + '-group';
            avatar.appendChild(eyeGroup);
        }

        // ovalo blanco (blanco del ojo)
        let whiteEye = document.getElementById(idPrefix + '-white');
        if (!whiteEye) {
            whiteEye = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            whiteEye.id = idPrefix + '-white';
            eyeGroup.appendChild(whiteEye);
        }

        // Iris (circulo negro)
        let iris = document.getElementById(idPrefix + '-iris');
        if (!iris) {
            iris = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            iris.id = idPrefix + '-iris';
            eyeGroup.appendChild(iris);
        }

        return { eyeGroup, whiteEye, iris };
    }

    // Crear ojos si no existen
    const eyeLeft = createEye('eye-left', 100, 140);
    const eyeRight = createEye('eye-right', 160, 140);

    // Crear cejas si no existen
    let eyebrowLeft = document.getElementById('eyebrow-left');
    let eyebrowRight = document.getElementById('eyebrow-right');

    if (!eyebrowLeft) {
        eyebrowLeft = document.createElementNS("http://www.w3.org/2000/svg", "path");
        eyebrowLeft.id = 'eyebrow-left';
        eyebrowLeft.setAttribute('stroke', 'black');
        eyebrowLeft.setAttribute('stroke-width', 2);
        eyebrowLeft.setAttribute('fill', 'none');
        avatar.appendChild(eyebrowLeft);
    }
    
    if (!eyebrowRight) {
        eyebrowRight = document.createElementNS("http://www.w3.org/2000/svg", "path");
        eyebrowRight.id = 'eyebrow-right';
        eyebrowRight.setAttribute('stroke', 'black');
        eyebrowRight.setAttribute('stroke-width', 2);
        eyebrowRight.setAttribute('fill', 'none');
        avatar.appendChild(eyebrowRight);
    }    

    // Estilo base de cejas
    [eyebrowLeft, eyebrowRight].forEach(eyebrow => {
        eyebrow.setAttribute('stroke', 'black');
        eyebrow.setAttribute('stroke-width', 3);
    });

    const eyeSelect = document.getElementById('eyeType');
    if (!eyeSelect) return;

    eyeSelect.addEventListener('change', e => {
        const val = e.target.value;

        // Ocultar elementos de ojos cerrados si existen
        const eyeLeftClosed = document.getElementById('eye-left-closed');
        const eyeRightClosed = document.getElementById('eye-right-closed');
        if (eyeLeftClosed) eyeLeftClosed.style.display = 'none';
        if (eyeRightClosed) eyeRightClosed.style.display = 'none';

        // Mostrar grupos de ojos
        eyeLeft.eyeGroup.style.display = 'block';
        eyeRight.eyeGroup.style.display = 'block';
        eyebrowLeft.style.display = 'block';
        eyebrowRight.style.display = 'block';

        switch (val) {
            case 'default':
                // Ojo izquierdo
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 140);
                eyeLeft.whiteEye.setAttribute('rx', 14);  // ancho del óvalo
                eyeLeft.whiteEye.setAttribute('ry', 10);  // alto del óvalo
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);

                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 140);
                eyeLeft.iris.setAttribute('r', 7);
                eyeLeft.iris.setAttribute('fill', 'black');

                // Ojo derecho
                eyeRight.whiteEye.setAttribute('cx', 160);
                eyeRight.whiteEye.setAttribute('cy', 140);
                eyeRight.whiteEye.setAttribute('rx', 14);
                eyeRight.whiteEye.setAttribute('ry', 10);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);

                eyeRight.iris.setAttribute('cx', 160);
                eyeRight.iris.setAttribute('cy', 140);
                eyeRight.iris.setAttribute('r', 7);
                eyeRight.iris.setAttribute('fill', 'black');

                // Cejas
                eyebrowLeft.setAttribute('d', 'M85 110 Q100 90 115 110');
                eyebrowRight.setAttribute('d', 'M145 110 Q160 90 175 110');
                break;

            case 'side':
                // Ojo izquierdo
                eyeLeft.whiteEye.setAttribute('cx', 90);
                eyeLeft.whiteEye.setAttribute('cy', 140);
                eyeLeft.whiteEye.setAttribute('rx', 10);
                eyeLeft.whiteEye.setAttribute('ry', 7);
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);

                eyeLeft.iris.setAttribute('cx', 90);
                eyeLeft.iris.setAttribute('cy', 140);
                eyeLeft.iris.setAttribute('r', 5);
                eyeLeft.iris.setAttribute('fill', 'black');

                // Ojo derecho
                eyeRight.whiteEye.setAttribute('cx', 170);
                eyeRight.whiteEye.setAttribute('cy', 140);
                eyeRight.whiteEye.setAttribute('rx', 10);
                eyeRight.whiteEye.setAttribute('ry', 7);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);

                eyeRight.iris.setAttribute('cx', 170);
                eyeRight.iris.setAttribute('cy', 140);
                eyeRight.iris.setAttribute('r', 5);
                eyeRight.iris.setAttribute('fill', 'black');

                // Cejas
                eyebrowLeft.setAttribute('d', 'M80 122 Q90 115 100 118');
                eyebrowRight.setAttribute('d', 'M160 118 Q170 115 180 122');
                break;

            case 'wink':
                // Ojo izquierdo sigue normal
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 140);
                eyeLeft.whiteEye.setAttribute('rx', 14);
                eyeLeft.whiteEye.setAttribute('ry', 10);
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);

                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 140);
                eyeLeft.iris.setAttribute('r', 7);
                eyeLeft.iris.setAttribute('fill', 'black');

                // Ojo derecho desaparece y se dibuja línea cerrada
                eyeRight.eyeGroup.style.display = 'none';

                let eyeRightClosed = document.getElementById('eye-right-closed');
                if (!eyeRightClosed) {
                    eyeRightClosed = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    eyeRightClosed.id = 'eye-right-closed';
                    avatar.appendChild(eyeRightClosed);
                }
                eyeRightClosed.setAttribute('x1', 150);
                eyeRightClosed.setAttribute('y1', 140);
                eyeRightClosed.setAttribute('x2', 170);
                eyeRightClosed.setAttribute('y2', 140);
                eyeRightClosed.setAttribute('stroke', 'black');
                eyeRightClosed.setAttribute('stroke-width', 3);
                eyeRightClosed.style.display = 'block';

                // Cejas
              
                eyebrowLeft.setAttribute('d', 'M90 120 Q100 120 110 120');
                eyebrowRight.setAttribute('d', 'M150 120 Q160 120 170 120');

                break;

            case 'happy':
                // Ojo izquierdo
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 130);
                eyeLeft.whiteEye.setAttribute('rx', 10);
                eyeLeft.whiteEye.setAttribute('ry', 7);
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);

                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 130);
                eyeLeft.iris.setAttribute('r', 5);
                eyeLeft.iris.setAttribute('fill', 'black');

                // Ojo derecho
                eyeRight.whiteEye.setAttribute('cx', 160);
                eyeRight.whiteEye.setAttribute('cy', 130);
                eyeRight.whiteEye.setAttribute('rx', 10);
                eyeRight.whiteEye.setAttribute('ry', 7);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);

                eyeRight.iris.setAttribute('cx', 160);
                eyeRight.iris.setAttribute('cy', 130);
                eyeRight.iris.setAttribute('r', 5);
                eyeRight.iris.setAttribute('fill', 'black');

                // Cejas
                eyebrowLeft.setAttribute('d', 'M90 115 Q100 110 110 112');
                eyebrowRight.setAttribute('d', 'M150 112 Q160 110 170 115');
                break;

            case 'surprised':
                // Ojo izquierdo grande, elipse blanca
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 140);
                eyeLeft.whiteEye.setAttribute('rx', 18);
                eyeLeft.whiteEye.setAttribute('ry', 14);
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);
            
                // Iris negro grande y visible
                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 140);
                eyeLeft.iris.setAttribute('r', 10);
                eyeLeft.iris.setAttribute('fill', 'black');
            
                // Ojo derecho grande
                eyeRight.whiteEye.setAttribute('cx', 160);
                eyeRight.whiteEye.setAttribute('cy', 140);
                eyeRight.whiteEye.setAttribute('rx', 18);
                eyeRight.whiteEye.setAttribute('ry', 14);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);
            
                // Iris negro grande y visible
                eyeRight.iris.setAttribute('cx', 160);
                eyeRight.iris.setAttribute('cy', 140);
                eyeRight.iris.setAttribute('r', 10);
                eyeRight.iris.setAttribute('fill', 'black');
            
                // Cejas curvas (usamos path para curvas)
                eyebrowLeft.setAttribute('d', 'M 85 110 Q 100 90 115 110'); // curva hacia arriba
                eyebrowLeft.setAttribute('stroke', 'black');
                eyebrowLeft.setAttribute('stroke-width', 2);
                eyebrowLeft.setAttribute('fill', 'none');
            
                eyebrowRight.setAttribute('d', 'M 145 110 Q 160 90 175 110'); // curva hacia arriba
                eyebrowRight.setAttribute('stroke', 'black');
                eyebrowRight.setAttribute('stroke-width', 2);
                eyebrowRight.setAttribute('fill', 'none');
                break;                

            case 'angry':
                // Ojo izquierdo
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 140);
                eyeLeft.whiteEye.setAttribute('rx', 11);
                eyeLeft.whiteEye.setAttribute('ry', 8);
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);

                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 140);
                eyeLeft.iris.setAttribute('r', 6);
                eyeLeft.iris.setAttribute('fill', 'black');

                // Ojo derecho
                eyeRight.whiteEye.setAttribute('cx', 160);
                eyeRight.whiteEye.setAttribute('cy', 140);
                eyeRight.whiteEye.setAttribute('rx', 11);
                eyeRight.whiteEye.setAttribute('ry', 8);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);

                eyeRight.iris.setAttribute('cx', 160);
                eyeRight.iris.setAttribute('cy', 140);
                eyeRight.iris.setAttribute('r', 6);
                eyeRight.iris.setAttribute('fill', 'black');

                // Cejas más inclinadas (más agresivas)
                eyebrowLeft.setAttribute('d', 'M90 115 Q100 130 110 125');
                eyebrowRight.setAttribute('d', 'M150 125 Q160 130 170 115');
                break;

            case 'closed':
                // Ojo izquierdo - blanco estirado
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 130);
                eyeLeft.whiteEye.setAttribute('rx', 15);  // Más ancho (estirado horizontalmente)
                eyeLeft.whiteEye.setAttribute('ry', 2);   // Muy plano (bajo)
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);
            
                // Iris muy pequeño (círculo negro)
                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 130);
                eyeLeft.iris.setAttribute('r', 1.5);
                eyeLeft.iris.setAttribute('fill', 'black');
            
                // Ojo derecho - blanco estirado
                eyeRight.whiteEye.setAttribute('cx', 160);
                eyeRight.whiteEye.setAttribute('cy', 130);
                eyeRight.whiteEye.setAttribute('rx', 15);
                eyeRight.whiteEye.setAttribute('ry', 2);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);
            
                // Iris muy pequeño
                eyeRight.iris.setAttribute('cx', 160);
                eyeRight.iris.setAttribute('cy', 130);
                eyeRight.iris.setAttribute('r', 1.5);
                eyeRight.iris.setAttribute('fill', 'black');
            
                // Cejas relajadas o sin cejas si quieres (ajusta o comenta)
                eyebrowLeft.setAttribute('d', 'M90 125 Q100 122 110 124');
                eyebrowRight.setAttribute('d', 'M150 124 Q160 122 170 125');
                break;

            default:
                // Por defecto igual que 'default'
                eyeLeft.whiteEye.setAttribute('cx', 100);
                eyeLeft.whiteEye.setAttribute('cy', 140);
                eyeLeft.whiteEye.setAttribute('rx', 14);
                eyeLeft.whiteEye.setAttribute('ry', 10);
                eyeLeft.whiteEye.setAttribute('fill', 'white');
                eyeLeft.whiteEye.setAttribute('stroke', 'black');
                eyeLeft.whiteEye.setAttribute('stroke-width', 1);

                eyeLeft.iris.setAttribute('cx', 100);
                eyeLeft.iris.setAttribute('cy', 140);
                eyeLeft.iris.setAttribute('r', 7);
                eyeLeft.iris.setAttribute('fill', 'black');

                eyeRight.whiteEye.setAttribute('cx', 160);
                eyeRight.whiteEye.setAttribute('cy', 140);
                eyeRight.whiteEye.setAttribute('rx', 14);
                eyeRight.whiteEye.setAttribute('ry', 10);
                eyeRight.whiteEye.setAttribute('fill', 'white');
                eyeRight.whiteEye.setAttribute('stroke', 'black');
                eyeRight.whiteEye.setAttribute('stroke-width', 1);

                eyeRight.iris.setAttribute('cx', 160);
                eyeRight.iris.setAttribute('cy', 140);
                eyeRight.iris.setAttribute('r', 7);
                eyeRight.iris.setAttribute('fill', 'black');

                eyebrowLeft.setAttribute('d', 'M90 120 Q100 115 110 120');
                eyebrowRight.setAttribute('d', 'M150 120 Q160 115 170 120');
                break;
        }
    });

    // Disparar evento cambio para inicializar la vista con el valor actual
    eyeSelect.dispatchEvent(new Event('change'));
});


