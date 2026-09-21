// Lightweight 2D Canvas Procedural Honey Jar Fallback (No heavy Three.js runtime needed)

export interface ProceduralHoneyConfig {
  liquidColor: string;
  amberTone: string;
  name: string;
  subtitle: string;
  botanicalName: string;
}

export const LIPOWY_FALLBACK_CONFIG: ProceduralHoneyConfig = {
  liquidColor: '#F5B027',
  amberTone: '#B56505',
  name: 'MIÓD LIPOWY',
  subtitle: 'Ze Starodrzewu Lipowego • Ciechów',
  botanicalName: 'Tilia cordata',
};

/**
 * Pure 2D Canvas procedural 360° jar frame generator.
 * Produces crisp transparent alpha frames as an edge-case fallback without external 3D libraries.
 */
export async function generateTransparent360JarFrames(
  totalFrames: number = 60,
  width: number = 480,
  height: number = 480,
  config: ProceduralHoneyConfig = LIPOWY_FALLBACK_CONFIG
): Promise<ImageBitmap[]> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: true });
  if (!ctx) return [];

  const bitmaps: ImageBitmap[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const angle = (i / totalFrames) * Math.PI * 2;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const jarW = width * 0.52;
    const jarH = height * 0.68;
    const jarX = cx - jarW / 2;
    const jarY = cy - jarH / 2 + 10;

    // 1. Honey Liquid Body
    const liquidGrad = ctx.createLinearGradient(jarX, jarY, jarX + jarW, jarY + jarH);
    liquidGrad.addColorStop(0, config.liquidColor);
    liquidGrad.addColorStop(0.5, config.amberTone);
    liquidGrad.addColorStop(1, '#6F3A06');

    ctx.fillStyle = liquidGrad;
    ctx.beginPath();
    ctx.roundRect(jarX + 6, jarY + 40, jarW - 12, jarH - 52, [0, 0, 24, 24]);
    ctx.fill();

    // 2. Glass Reflections & Depth
    const glassGrad = ctx.createLinearGradient(jarX, jarY, jarX + jarW, jarY);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    glassGrad.addColorStop(0.18, 'rgba(255, 255, 255, 0.08)');
    glassGrad.addColorStop(0.82, 'rgba(255, 255, 255, 0.05)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.35)');

    ctx.strokeStyle = glassGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(jarX, jarY + 36, jarW, jarH - 46, [6, 6, 28, 28]);
    ctx.stroke();

    // 3. Rotating Label Simulation
    const cosA = Math.cos(angle);
    if (cosA > -0.2) {
      const labelW = (jarW * 0.82) * Math.max(0, cosA);
      const labelX = cx - labelW / 2 + (Math.sin(angle) * jarW * 0.15);
      const labelY = jarY + jarH * 0.28;
      const labelH = jarH * 0.44;

      if (labelW > 8) {
        ctx.fillStyle = '#FAF6ED';
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelW, labelH, 4);
        ctx.fill();
        ctx.stroke();

        if (labelW > jarW * 0.4) {
          ctx.fillStyle = '#2B231A';
          ctx.font = 'bold 12px serif';
          ctx.textAlign = 'center';
          ctx.fillText(config.name, cx, labelY + labelH * 0.45);
          ctx.font = 'italic 9px serif';
          ctx.fillStyle = '#6E522C';
          ctx.fillText('PASIEKA USZA', cx, labelY + labelH * 0.25);
        }
      }
    }

    // 4. Gold Cap / Lid
    const lidW = jarW * 0.88;
    const lidH = 34;
    const lidX = cx - lidW / 2;
    const lidY = jarY + 8;

    const lidGrad = ctx.createLinearGradient(lidX, lidY, lidX + lidW, lidY);
    lidGrad.addColorStop(0, '#A67C1E');
    lidGrad.addColorStop(0.3, '#FFDF73');
    lidGrad.addColorStop(0.5, '#E5B83B');
    lidGrad.addColorStop(0.8, '#FFE79A');
    lidGrad.addColorStop(1, '#8C6412');

    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.roundRect(lidX, lidY, lidW, lidH, [6, 6, 2, 2]);
    ctx.fill();

    ctx.strokeStyle = '#6E4D0C';
    ctx.lineWidth = 1;
    ctx.stroke();

    try {
      const bmp = await createImageBitmap(canvas);
      bitmaps.push(bmp);
    } catch {
      // fallback
    }
  }

  return bitmaps;
}
