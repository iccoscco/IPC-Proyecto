document.addEventListener('DOMContentLoaded', () => {
    const hair = document.getElementById('hair');
  
    // Cambiar color pelo
    document.getElementById('colorPelo')?.addEventListener('input', e => {
      if (hair) {
        hair.setAttribute('fill', e.target.value);
      }
    });
  
    // Cambiar tipo de pelo
    document.getElementById('hairType')?.addEventListener('change', e => {
      if (!hair) return;
  
      const tipo = e.target.value;
      switch (tipo) {
        case 'default':
          hair.setAttribute('d', 'M60 90 Q125 15 190 90 Q125 38 60 110 Z');
          break;
        case 'curly':
          hair.setAttribute('d', `
            M60 75
            Q80 5 100 55
            Q120 15 140 65
            Q160 25 180 75
            Q160 95 140 85
            Q120 105 100 85
            Q80 95 50 75
            Z
        `);
          break;
        case 'short':
        hair.setAttribute('d', `
            M60 100
            Q80 60 110 50
            Q140 40 170 55
            Q185 60 180 80
            Q175 100 155 95
            Q140 92 125 98
            Q110 105 95 100
            Q75 95 60 100
            Z
          `);
          break;
        case 'long':
          hair.setAttribute('d', 'M50 93 Q80 53, 110 63 Q140 33, 190 73 Q170 83, 150 93 Q180 93, 190 113 Q150 83, 110 93 Q70 103, 50 93 Z');
          break;
        case 'mohawk':
        hair.setAttribute('d', `
            M120 60
            Q125 40 130 30
            Q135 20 140 30
            Q145 40 150 60
            Q145 70 140 75
            Q135 80 130 75
            Q125 70 120 60
            Z
          `);
          break;
        case 'bun':
          hair.setAttribute('d', 'M100 60 A20 20 0 1 1 164 60 Q160 30 100 60Z');
          break;
        case 'bald':
          hair.setAttribute('d', ''); // Sin cabello
          break;
      }
    });
  });
  