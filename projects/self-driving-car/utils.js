class Utils {
  static segmentIntersection(v1, v2, v3, v4) {
    // source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
    // Mi történik, ha a denominator = 0?
    const x1 = v1.x;
    const y1 = v1.y;
    const x2 = v2.x;
    const y2 = v2.y;
    const x3 = v3.x;
    const y3 = v3.y;
    const x4 = v4.x;
    const y4 = v4.y;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;
    // print(v1, v2, v3, v4)
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const ix = x1 + t * (x2 - x1);
      const iy = y1 + t * (y2 - y1);
      const intersectionPoint = createVector(ix, iy);
      return intersectionPoint;
    }
    return undefined;
  }
  
  static mutationFunction(elem) {
    // ezt nem itt kellene tárolni!
    let shiftValue = random(-mutationRate, mutationRate)
    return elem + shiftValue;
  }
}