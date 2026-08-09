export const SPHERE_KEY = "4D27BCCC05294C9FA3C6EF01401D8942";

export const sphereTileUrl = (layer = "thailand_map") =>
  `https://basemap.sphere.gistda.or.th/tiles/${layer}/EPSG3857/{z}/{x}/{y}.jpeg?key=${SPHERE_KEY}`;

export type ApiStatus = "checking" | "online" | "fallback";

/** Lightweight reachability probe for the GISTDA Sphere services. */
export async function probeSphere(): Promise<ApiStatus> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    await fetch(
      `https://basemap.sphere.gistda.or.th/tiles/thailand_map/EPSG3857/8/200/117.jpeg?key=${SPHERE_KEY}`,
      { signal: ctrl.signal, mode: "no-cors", cache: "no-store" },
    );
    clearTimeout(timer);
    return "online";
  } catch {
    return "fallback";
  }
}