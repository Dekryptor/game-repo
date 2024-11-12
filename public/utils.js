// Helper functions
export function toDegs(rad) {
  return Math.abs(rad * (180 / Math.PI));
}

export function calcAngle(x, y, destX, destY) {
  let angle = ((Math.atan2(destX - x, destY - y) * 180) / Math.PI + 360) % 360;
  return toRadians(angle);
}

export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function convertToMapCoords({ x, y }, camera, halfScreenWidth, halfScreenHeight) {
  x = camera.followX + (x - halfScreenWidth);
  y = camera.followY + (y - halfScreenHeight);
  return { x, y };
}