import { GraveLocation } from "./type";

export interface Province {
  code: string;
  name: string;
  // Đã xóa 'mien: Mien'
  centralLongitude: number;
  centralLatitude: number;
}

export const provinceData: Province[] = [
  // Miền Bắc
  {
    code: "01",
    name: "Hà Nội",
    centralLongitude: 105.85,
    centralLatitude: 21.02,
  },
  {
    code: "02",
    name: "Hà Giang",
    centralLongitude: 104.98,
    centralLatitude: 22.8,
  },
  {
    code: "04",
    name: "Cao Bằng",
    centralLongitude: 106.25,
    centralLatitude: 22.66,
  },
  {
    code: "06",
    name: "Bắc Kạn",
    centralLongitude: 105.83,
    centralLatitude: 22.15,
  },
  {
    code: "08",
    name: "Tuyên Quang",
    centralLongitude: 105.21,
    centralLatitude: 21.82,
  },
  {
    code: "10",
    name: "Lào Cai",
    centralLongitude: 103.96,
    centralLatitude: 22.48,
  },
  {
    code: "11",
    name: "Điện Biên",
    centralLongitude: 103.01,
    centralLatitude: 21.38,
  },
  {
    code: "12",
    name: "Lai Châu",
    centralLongitude: 103.46,
    centralLatitude: 22.4,
  },
  {
    code: "14",
    name: "Sơn La",
    centralLongitude: 103.91,
    centralLatitude: 21.32,
  },
  {
    code: "15",
    name: "Yên Bái",
    centralLongitude: 104.91,
    centralLatitude: 21.72,
  },
  {
    code: "17",
    name: "Hoà Bình",
    centralLongitude: 105.33,
    centralLatitude: 20.81,
  },
  {
    code: "19",
    name: "Thái Nguyên",
    centralLongitude: 105.84,
    centralLatitude: 21.59,
  },
  {
    code: "20",
    name: "Lạng Sơn",
    centralLongitude: 106.75,
    centralLatitude: 21.85,
  },
  {
    code: "22",
    name: "Quảng Ninh",
    centralLongitude: 107.07,
    centralLatitude: 21.46,
  },
  {
    code: "24",
    name: "Bắc Giang",
    centralLongitude: 106.19,
    centralLatitude: 21.27,
  },
  {
    code: "25",
    name: "Phú Thọ",
    centralLongitude: 105.4,
    centralLatitude: 21.35,
  },
  {
    code: "26",
    name: "Vĩnh Phúc",
    centralLongitude: 105.6,
    centralLatitude: 21.3,
  },
  {
    code: "27",
    name: "Bắc Ninh",
    centralLongitude: 106.07,
    centralLatitude: 21.18,
  },
  {
    code: "30",
    name: "Hải Dương",
    centralLongitude: 106.3,
    centralLatitude: 20.93,
  },
  {
    code: "31",
    name: "Hải Phòng",
    centralLongitude: 106.68,
    centralLatitude: 20.84,
  },
  {
    code: "33",
    name: "Hưng Yên",
    centralLongitude: 106.05,
    centralLatitude: 20.65,
  },
  {
    code: "34",
    name: "Thái Bình",
    centralLongitude: 106.33,
    centralLatitude: 20.45,
  },
  {
    code: "35",
    name: "Hà Nam",
    centralLongitude: 105.9,
    centralLatitude: 20.53,
  },
  {
    code: "36",
    name: "Nam Định",
    centralLongitude: 106.17,
    centralLatitude: 20.42,
  },
  {
    code: "37",
    name: "Ninh Bình",
    centralLongitude: 105.97,
    centralLatitude: 20.25,
  },
  // Miền Trung
  {
    code: "38",
    name: "Thanh Hoá",
    centralLongitude: 105.78,
    centralLatitude: 19.8,
  },
  {
    code: "40",
    name: "Nghệ An",
    centralLongitude: 105.69,
    centralLatitude: 18.67,
  },
  {
    code: "42",
    name: "Hà Tĩnh",
    centralLongitude: 105.9,
    centralLatitude: 18.33,
  },
  {
    code: "44",
    name: "Quảng Bình",
    centralLongitude: 106.63,
    centralLatitude: 17.46,
  },
  {
    code: "45",
    name: "Quảng Trị",
    centralLongitude: 107.18,
    centralLatitude: 16.82,
  },
  {
    code: "46",
    name: "Thừa Thiên Huế",
    centralLongitude: 107.59,
    centralLatitude: 16.46,
  },
  {
    code: "48",
    name: "Đà Nẵng",
    centralLongitude: 108.22,
    centralLatitude: 16.06,
  },
  {
    code: "49",
    name: "Quảng Nam",
    centralLongitude: 108.27,
    centralLatitude: 15.58,
  },
  {
    code: "51",
    name: "Quảng Ngãi",
    centralLongitude: 108.79,
    centralLatitude: 15.12,
  },
  {
    code: "52",
    name: "Bình Định",
    centralLongitude: 109.21,
    centralLatitude: 13.77,
  },
  {
    code: "54",
    name: "Phú Yên",
    centralLongitude: 109.3,
    centralLatitude: 13.09,
  },
  {
    code: "56",
    name: "Khánh Hòa",
    centralLongitude: 109.19,
    centralLatitude: 12.23,
  },
  {
    code: "58",
    name: "Ninh Thuận",
    centralLongitude: 108.99,
    centralLatitude: 11.56,
  },
  {
    code: "60",
    name: "Bình Thuận",
    centralLongitude: 108.1,
    centralLatitude: 10.93,
  },
  {
    code: "62",
    name: "Kon Tum",
    centralLongitude: 108.0,
    centralLatitude: 14.35,
  },
  {
    code: "64",
    name: "Gia Lai",
    centralLongitude: 107.97,
    centralLatitude: 13.98,
  },
  {
    code: "66",
    name: "Đắk Lắk",
    centralLongitude: 108.04,
    centralLatitude: 12.66,
  },
  {
    code: "67",
    name: "Đắk Nông",
    centralLongitude: 107.69,
    centralLatitude: 12.0,
  },
  {
    code: "68",
    name: "Lâm Đồng",
    centralLongitude: 108.43,
    centralLatitude: 11.94,
  },
  // Miền Nam
  {
    code: "70",
    name: "Bình Phước",
    centralLongitude: 106.91,
    centralLatitude: 11.65,
  },
  {
    code: "72",
    name: "Tây Ninh",
    centralLongitude: 106.1,
    centralLatitude: 11.3,
  },
  {
    code: "74",
    name: "Bình Dương",
    centralLongitude: 106.68,
    centralLatitude: 10.98,
  },
  {
    code: "75",
    name: "Đồng Nai",
    centralLongitude: 106.82,
    centralLatitude: 10.95,
  },
  {
    code: "77",
    name: "Bà Rịa - Vũng Tàu",
    centralLongitude: 107.07,
    centralLatitude: 10.34,
  },
  {
    code: "79",
    name: "TP Hồ Chí Minh",
    centralLongitude: 106.62,
    centralLatitude: 10.82,
  },
  {
    code: "80",
    name: "Long An",
    centralLongitude: 106.4,
    centralLatitude: 10.53,
  },
  {
    code: "82",
    name: "Tiền Giang",
    centralLongitude: 106.35,
    centralLatitude: 10.35,
  },
  {
    code: "83",
    name: "Bến Tre",
    centralLongitude: 106.37,
    centralLatitude: 10.23,
  },
  {
    code: "84",
    name: "Trà Vinh",
    centralLongitude: 106.33,
    centralLatitude: 9.93,
  },
  {
    code: "86",
    name: "Vĩnh Long",
    centralLongitude: 105.97,
    centralLatitude: 10.25,
  },
  {
    code: "87",
    name: "Đồng Tháp",
    centralLongitude: 105.75,
    centralLatitude: 10.45,
  },
  {
    code: "89",
    name: "An Giang",
    centralLongitude: 105.42,
    centralLatitude: 10.38,
  },
  {
    code: "91",
    name: "Kiên Giang",
    centralLongitude: 105.08,
    centralLatitude: 10.0,
  },
  {
    code: "92",
    name: "Cần Thơ",
    centralLongitude: 105.77,
    centralLatitude: 10.03,
  },
  {
    code: "93",
    name: "Hậu Giang",
    centralLongitude: 105.47,
    centralLatitude: 9.78,
  },
  {
    code: "94",
    name: "Sóc Trăng",
    centralLongitude: 105.97,
    centralLatitude: 9.6,
  },
  {
    code: "95",
    name: "Bạc Liêu",
    centralLongitude: 105.72,
    centralLatitude: 9.28,
  },
  {
    code: "96",
    name: "Cà Mau",
    centralLongitude: 105.15,
    centralLatitude: 9.17,
  },
];

// Hàm tìm tỉnh gần nhất theo tọa độ
const toRad = (deg: number) => (deg * Math.PI) / 180;
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
export const findNearestProvince = (lng: number, lat: number) => {
  return provinceData.reduce((prev, curr) => {
    const prevDist = haversineDistance(
      lat,
      lng,
      prev.centralLatitude,
      prev.centralLongitude
    );
    const currDist = haversineDistance(
      lat,
      lng,
      curr.centralLatitude,
      curr.centralLongitude
    );
    return prevDist < currDist ? prev : curr;
  });
};
export const getProvinceByCoords = (
  lat: number,
  lng: number
): string | null => {
  const nearest = findNearestProvince(lng, lat);
  return nearest ? nearest.name : null;
};
