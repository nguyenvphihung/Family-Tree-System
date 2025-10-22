export type GraveIcon = "user" | "heart" | "star" | "flower";

// Đã cập nhật GraveLocation, chỉ còn 'province'
export type GraveLocation = {
  province: string;
};

// Mộ phần (Tự động cập nhật để sử dụng GraveLocation mới)
export type Grave = {
  id: string;
  name: string;
  relation: string;
  description: string;
  birthYear: number | null;
  deathYear: number | null;
  location: GraveLocation;
  coordinates: { lat: number; lng: number };
  icon: GraveIcon;
  address?: string;
};
