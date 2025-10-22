export const vietnamBoundary: { lat: number; lng: number }[] = [];
export const loadVietnamBoundary = async (): Promise<
  { lat: number; lng: number }[]
> => {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    );
    const data = await res.json();

    // Tìm dữ liệu của Việt Nam
    const vietnam = data.features.find(
      (f: any) => f.properties.name === "Vietnam"
    );

    if (!vietnam) throw new Error("Không tìm thấy dữ liệu Việt Nam!");

    // Lấy danh sách toạ độ
    const coords = vietnam.geometry.coordinates[0][0];

    // { lat, lng }
    vietnamBoundary.splice(
      0,
      vietnamBoundary.length,
      ...coords.map(([lng, lat]: [number, number]) => ({ lat, lng }))
    );

    console.log(
      "✅ Biên giới Việt Nam đã tải xong:",
      vietnamBoundary.length,
      "điểm"
    );
    return vietnamBoundary;
  } catch (error) {
    console.error("❌ Lỗi tải biên giới Việt Nam:", error);
    return [];
  }
};
