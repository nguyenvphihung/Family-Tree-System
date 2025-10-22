export const isPointInPolygon = (
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean => {
  const { lat, lng } = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const vertex1_lat = polygon[i].lat; // y_i
    const vertex1_lng = polygon[i].lng; // x_i
    const vertex2_lat = polygon[j].lat; // y_j
    const vertex2_lng = polygon[j].lng; // x_j

    // Thuật toán Ray-casting để kiểm tra
    const intersect =
      vertex1_lat > lat !== vertex2_lat > lat &&
      lng <
        ((vertex2_lng - vertex1_lng) * (lat - vertex1_lat)) /
          (vertex2_lat - vertex1_lat) +
          vertex1_lng;

    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
};
