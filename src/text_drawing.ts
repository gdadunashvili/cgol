export function draw_text(
  text: string,
  top_left_corner: { x: number; y: number },
  width: number,
  height: number,
  color: string,
  context: CanvasRenderingContext2D 
): void {

  // Calculate font size based on the height of the rectangle
  // This can be tuned to better fit the width if needed
  const fontSize = Math.min(width, height) * 0.8;
  context.font = `${fontSize}px sans-serif`;
  context.textBaseline = 'top';
  context.textAlign = 'left';

  // Optional: clear the rectangle before drawing
  // context.clearRect(top_left_corner.x, top_left_corner.y, width, height);

  // Measure text to center it inside the box
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  const offsetX = (width - textWidth) / 2;
  const offsetY = (height - textHeight) / 2;

  let old_fill = context.fillStyle
  context.fillStyle = color; // Or any color you prefer
  context.fillText(text, top_left_corner.x + offsetX, top_left_corner.y + offsetY);
  context.fillStyle = old_fill 
}

