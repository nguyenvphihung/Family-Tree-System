import { Grave, GraveLocation } from "./type";
import { findNearestProvince } from "./provinces.data";
import {
  vietnamBoundary,
  loadVietnamBoundary,
} from "./Components/VietNamBoundary";
import { isPointInPolygon } from "./utils";
const getRandomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const getRandomLocationAndCoords = (): {
  location: GraveLocation;
  coordinates: { lat: number; lng: number };
} => {
  let lat, lng, point;
  do {
    lat = getRandomInRange(8.5, 23.5);
    lng = getRandomInRange(102.0, 109.5);
    point = { lat, lng };
  } while (
    vietnamBoundary.length > 0 &&
    !isPointInPolygon(point, vietnamBoundary)
  );
  const nearestProvince = findNearestProvince(lng, lat);
  return {
    location: { province: nearestProvince.name },
    coordinates: { lat, lng },
  };
};

// Tạo ra một danh sách mộ giả (mock data)
const generateMockData = (): Grave[] => {
  return Array.from({ length: 20 }, (_, i) => {
    const { location, coordinates } = getRandomLocationAndCoords();
    return {
      id: (100 + i).toString(),
      name: `Người Họ Hàng ${i + 1}`,
      birthYear: 1930 + i,
      deathYear: 2000 + i,
      location,
      coordinates,
      relation: "Họ hàng",
      description: "Thông tin bổ sung về người này.",
      icon: "user",
    };
  });
};

let MOCK_GRAVE_DATA: Grave[] = [];

export const fetchGravesFromAPI = async (): Promise<Grave[]> => {
  console.log("Đang sử dụng dữ liệu giả (mock data).");

  if (vietnamBoundary.length === 0) {
    try {
      await loadVietnamBoundary();
      console.log("Tải ranh giới xong, bắt đầu tạo mock data.");
    } catch (error) {
      console.error("Lỗi tải ranh giới khi tạo mock data:", error);
    }
  }

  if (MOCK_GRAVE_DATA.length === 0) {
    MOCK_GRAVE_DATA = generateMockData();
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_GRAVE_DATA]);
    }, 500);
  });
};
export const addGraveToAPI = async (
  graveData: Omit<Grave, "id">
): Promise<Grave> => {
  console.log("API: Giả lập thêm mộ mới.");
  const newGrave = { ...graveData, id: Math.random().toString() };
  return newGrave;
};

export const updateGraveInAPI = async (
  graveId: string,
  updatedData: Partial<Omit<Grave, "id">>
): Promise<Grave> => {
  console.log("API: Giả lập cập nhật mộ.");
  const originalGrave = MOCK_GRAVE_DATA.find((g) => g.id === graveId);
  const updatedGrave = {
    ...originalGrave,
    ...updatedData,
    id: graveId,
  } as Grave;

  return updatedGrave;
};

export const deleteGraveFromAPI = async (graveId: string): Promise<void> => {
  console.log("API: Giả lập xóa mộ.");
  return;
};
