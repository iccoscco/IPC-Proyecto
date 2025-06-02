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
          hair.setAttribute('d', 'M 59 113 Q 36 60 98 55 Q 122 53 99 39 Q 162 40 166 58 Q 215 74 204 110 Q 182 88 170 92 Q 146 108 87 91 Z');
          break;
        case 'curly':
          hair.setAttribute('d', `M 60 90 Q 59 68 79 58 Q 95 31 124 45 Q 136 52 140 49 Q 160 37 173 51 Q 200 48 204 69 Q 231 91 207 120 Q 200 82 164 78 Q 154 66 142 67 Q 122 68 115 61 Q 116 71 94 74 Q 83 74 72 87 Q 73 103 56 119 Z`);
          break;
        case 'short':
        hair.setAttribute('d', `M 60 100 Q 80 60 110 50 Q 140 40 170 55 Q 185 60 191 90 Q 185 93 178 80 Q 140 92 116 81 Q 110 100 82 95 Q 75 95 60 100 Z`);
          break;
        case 'long':
          hair.setAttribute('d', 'M 57 129 Q 60 102 32 113 Q 53 54 64 65 Q 95 57 59 26 Q 98 30 111 50 Q 114 46 123 36 Q 141 26 197 54 Q 149 51 181 62 Q 212 70 219 109 Q 190 90 187 127 Q 183 106 160 98 Q 128 94 120 82 Q 106 111 78 112 Q 65 96 56 147 Z');
          break;
        case 'mohawk':
        hair.setAttribute('d', `M 120 60 Q 122 45 126 37 Q 128 33 130 30 Q 132 27 133 24 Q 137 22 140 30 Q 143 38 145 42 Q 147 48 150 60 Q 160 60 171 68 Q 145 76 149 70 Q 137 77 135 78 Q 123 79 130 75 Q 127 71 100 68 Q 113 59 120 60 Z`);
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
  