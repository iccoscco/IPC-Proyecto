document.addEventListener('DOMContentLoaded', () => {
    // Variables para elementos

    const face = document.getElementById('face');
    const neck = document.getElementById('neck');
    const armLeft = document.getElementById('arm-left');
    const armRight = document.getElementById('arm-right');
    const earLeft = document.getElementById('ear-left');
    const earRight = document.getElementById('ear-right');
    const inearLeft = document.getElementById('in-ear-left');
    const inearRight = document.getElementById('in-ear-right');
    const body = document.getElementById('body');
    const lips = document.getElementById('lips');
  

  
    // Cambiar color piel
    document.getElementById('colorPiel')?.addEventListener('input', e => {
      const color = e.target.value;
      face?.setAttribute('fill', color);
      neck?.setAttribute('fill', color);
      armLeft?.setAttribute('fill', color);
      armRight?.setAttribute('fill', color);
      earLeft?.setAttribute('fill', color);
      earRight?.setAttribute('fill', color);
    });

    // Cambiar sombras color piel
    document.getElementById('colorPielSombras')?.addEventListener('input', e => {
        const color = e.target.value;
        lips?.setAttribute('fill', color);
        inearLeft?.setAttribute('fill', color);
        inearRight?.setAttribute('fill', color);
      });
  
    // Cambiar color uniforme
    document.getElementById('colorUniforme')?.addEventListener('input', e => {
      body?.setAttribute('fill', e.target.value);
    });
      
  
    // Exportar SVG
    function download(filename, text) {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  
    document.getElementById('exportSvg')?.addEventListener('click', () => {
      const svg = document.getElementById('avatar')?.outerHTML;
      if (svg) {
        download('avatar.svg', svg);
      }
    });
  
    const usarAvatarBtn = document.getElementById("usarAvatar");
    if (usarAvatarBtn) {
      usarAvatarBtn.addEventListener("click", () => {
        const svgElement = document.getElementById("avatar");
        const usuarioInput = document.getElementById("usuario_id");
  
        if (!svgElement || !usuarioInput) {
          alert("No se encontró el avatar o el usuario_id");
          return;
        }
  
        const svgData = new XMLSerializer().serializeToString(svgElement);
  
        fetch("/guardar_avatar_svg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            svg: svgData,
            usuario_id: usuarioInput.value
          })
        })
        .then(res => {
          if (res.ok) {
            alert("Avatar guardado para el sistema");
            window.location.href = "/usuarios";
          } else {
            alert("Error al guardar el avatar");
          }
        });
      });
    }
  });
  

  