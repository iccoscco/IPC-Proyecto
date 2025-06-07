let intervaloBoca;

export function moverBoca() {
    const labios = document.getElementById('lips');
    const boca = document.getElementById('mouth');
    if (!labios || !boca) return;

    const formasLabios = [
        // Labios cerrados
        "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103 177 C 116 182 122 182 127 182 C 133 183 137 182 146 181 C 148 181 155 180 163 177 C 154 186 152 185 146 186 C 137 187 132 189 116 185 Z",
        // Semi abiertos
        "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103.8 183.2 C 111.5 190.2 118.5 189.5 122.7 189.5 C 137.4 189.5 140.2 188.8 146.5 188.1 C 151.4 186 154.9 185.3 161.2 181.1 C 153.5 189.5 150.7 192.3 146.5 194.4 C 140.2 198.6 123.4 199.3 112.9 193 Z",
        // Abiertos
        "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103.8 183.2 C 111.5 190.2 115 193 118 194 C 125 196 135 197 146 193 C 152 190 154.9 185.3 158 185 C 153.5 189.5 153 194 146 197 C 140.2 198.6 123 202 112 194 Z"
    ];

    const formasBoca = [
        "M 114 179 C 127 180 134 181 160 177 C 160 179 145 182 131 182 C 126 182 110 181 106 177 Z", // Cerrado: sin espacio interno
        "M 103 176 Q 122 184 165 176 C 153 185 155 186 131 186 C 112 186 109.33 182.6 107 182 Z", // Semiabierto
        "M 103 176 Q 122 184 165 176 C 148 192 147 193 139 195 C 117 198 111 189 107 185 Z"  // Abierto
    ];

    let i = 0;
    clearInterval(intervaloBoca);
    intervaloBoca = setInterval(() => {
        labios.setAttribute('d', formasLabios[i % formasLabios.length]);
        boca.setAttribute('d', formasBoca[i % formasBoca.length]);
        i++;
    }, 200);
}


export function detenerBoca() {
    clearInterval(intervaloBoca);
    const boca = document.getElementById('mouth');
    const labios = document.getElementById('lips');
    // Cerrado: sin espacio interno
    if (labios) {
        labios.setAttribute('d', "M 96.8 173.4 C 104.5 176.2 109.4 174.1 117.1 172 C 126.2 170.6 132.5 177.6 143 171.3 C 150 171.3 152.8 175.5 168.9 174.8 C 160.5 177.6 161.2 176.9 152 178 C 142 179 120 182 107 177 Z M 103 177 C 116 182 122 182 127 182 C 133 183 137 182 146 181 C 148 181 155 180 163 177 C 154 186 152 185 146 186 C 137 187 132 189 116 185 Z");
    }
    if (boca) {
        boca.setAttribute('d', "M 114 179 C 127 180 134 181 160 177 C 160 179 145 182 131 182 C 126 182 110 181 106 177 Z"); 
    }
}

