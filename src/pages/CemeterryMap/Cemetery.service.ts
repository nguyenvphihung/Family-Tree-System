import { Grave, GetTreesResponse, GetPersonsResponse } from "./type";
import { PersonInfo, UpdateDeathInfoRequest } from "@/types/person";
import { env } from "@/config/env";
import api from "@/config/axios";
import { getProvinceByCoords } from "./provinces.data";

const API_BASE_URL = env.API_BASE_URL;
const parseGravePlace = (
  gravePlace: string
): { lat: number; lng: number } | null => {
  try {
    const parts = gravePlace.split(",");
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (error) {
    console.error("Lỗi parse gravePlace:", gravePlace, error);
  }
  return null;
};

// Helper: Convert PersonInfo to Grave
const personToGrave = (person: PersonInfo): Grave | null => {
  console.log("🔍 Checking person:", {
    name: person.name,
    deathPlace: person.deathPlace,
    gravePlace: person.gravePlace,
  });

  // Chỉ lấy người đã mất (có deathPlace hoặc gravePlace)
  if (!person.deathPlace && !person.gravePlace) {
    console.log("⏭️ Bỏ qua - Không có thông tin mộ");
    return null;
  }

  const coordinates = person.gravePlace
    ? parseGravePlace(person.gravePlace)
    : null;

  if (!coordinates) {
    console.log("⚠️ Có deathPlace nhưng không có tọa độ gravePlace");
    return null; // Bỏ qua nếu không có tọa độ
  }

  // Tính province từ coordinates
  const province = getProvinceByCoords(coordinates.lat, coordinates.lng);

  // Parse birth year from birthday
  const birthYear = person.birthday
    ? new Date(person.birthday).getFullYear()
    : null;

  return {
    id: person.id,
    treeId: person.treeId,
    name: person.name,
    relation: person.generation || "Không rõ",
    description: person.deathPlace || "",
    birthYear,
    deathYear: null, // Chưa có trong API
    location: { province: province || "Không xác định" },
    coordinates,
    icon: person.gender === "MALE" ? "user" : "heart",
    address: person.deathPlace,
    avatarUrl: person.avatarUrl,
    gender: person.gender,
  };
};

// ==================== GET ALL TREES ====================
export const fetchTreesFromAPI = async (): Promise<GetTreesResponse["data"]> => {
  try {
    console.log("Đang tải danh sách cây gia phả...");
    const response = await api.get<GetTreesResponse>(`/trees`);
    console.log("✅ Đã tải", response.data.data.length, "cây");
    return response.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách cây:", error);
    throw error;
  }
};

// ==================== GET ALL PERSONS IN TREE ====================
export const fetchPersonsFromAPI = async (
  treeId: string
): Promise<PersonInfo[]> => {
  try {
    console.log("Đang tải danh sách người trong cây:", treeId);
    const response = await api.get<GetPersonsResponse>(
      `/persons/${treeId}`
    );
    console.log("✅ Đã tải", response.data.data.length, "người");
    return response.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách người:", error);
    throw error;
  }
};

// ==================== GET ALL PERSONS FROM ALL TREES ====================
export const fetchAllPersonsFromAPI = async (): Promise<Array<PersonInfo & { treeName: string }>> => {
  try {
    console.log("Đang tải tất cả người từ tất cả cây...");
    
    // First, fetch all trees
    const trees = await fetchTreesFromAPI();
    
    // Then, fetch persons from each tree
    const allPersonsPromises = trees.map(async (tree) => {
      const persons = await fetchPersonsFromAPI(tree.id);
      // Add treeName to each person
      return persons.map(person => ({
        ...person,
        treeName: tree.name
      }));
    });
    
    const allPersonsArrays = await Promise.all(allPersonsPromises);
    const allPersons = allPersonsArrays.flat();
    
    console.log("✅ Đã tải tổng", allPersons.length, "người từ", trees.length, "cây");
    return allPersons;
  } catch (error) {
    console.error("❌ Lỗi khi tải tất cả người:", error);
    throw error;
  }
};

// ==================== GET GRAVES (Người đã mất) ====================
export const fetchGravesFromAPI = async (treeId?: string): Promise<Grave[]> => {
  try {
    // Nếu không có treeId, lấy tree đầu tiên
    let selectedTreeId = treeId;
    if (!selectedTreeId) {
      const trees = await fetchTreesFromAPI();
      if (trees.length === 0) {
        console.warn("⚠️ Không có cây gia phả nào");
        return [];
      }
      selectedTreeId = trees[0].id;
      console.log("📌 Sử dụng cây mặc định:", trees[0].name);
    }

    // Lấy tất cả người trong cây
    const persons = await fetchPersonsFromAPI(selectedTreeId);

    // Filter và convert sang Grave
    const graves = persons
      .map(personToGrave)
      .filter((grave): grave is Grave => grave !== null);

    console.log("✅ Tìm thấy", graves.length, "mộ phần");
    return graves;
  } catch (error) {
    console.error("❌ Lỗi khi tải dữ liệu mộ:", error);
    throw error;
  }
};

// ==================== ADD/UPDATE GRAVE (Update Death Info) ====================
export const addGraveToAPI = async (
  personId: string,
  coords: { lat: number; lng: number },
  address: string
): Promise<PersonInfo> => {
  try {
    console.log("Đang cập nhật thông tin mộ cho person:", personId);

    // Prepare death info update (không set deathDate - để user tự cập nhật sau)
    const deathInfoUpdate: UpdateDeathInfoRequest = {
      deathPlace: address,
      gravePlace: `${coords.lat},${coords.lng}`, // Format: "lat,lng" (không lưu zoom)
      // deathDate không được set - để user tự cập nhật sau qua tính năng Edit
    };

    const response = await api.patch<{ code: number; status: string; message: string; data: PersonInfo }>(
      `/persons/${personId}/death-info`,
      deathInfoUpdate
    );

    console.log("✅ Đã cập nhật thông tin mộ thành công");
    return response.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thông tin mộ:", error);
    throw new Error("Không thể cập nhật thông tin mộ. Vui lòng thử lại.");
  }
};

export const updateGraveInAPI = async (
  graveId: string,
  updatedData: Partial<Omit<Grave, "id">>
): Promise<Grave> => {
  try {
    console.log("Đang cập nhật thông tin mộ...");

    // Prepare death info update
    const deathInfoUpdate: Partial<UpdateDeathInfoRequest> = {};

    if (updatedData.address) {
      deathInfoUpdate.deathPlace = updatedData.address;
    }

    if (updatedData.coordinates) {
      // Format: "lat,lng" (không lưu zoom)
      deathInfoUpdate.gravePlace = `${updatedData.coordinates.lat},${updatedData.coordinates.lng}`;
    }

    // TODO: Thêm deathDate khi có dữ liệu
    if (updatedData.deathYear) {
      // Tạm thời set ngày 1/1 của năm mất
      deathInfoUpdate.deathDate = `${updatedData.deathYear}-01-01T00:00:00.000Z`;
    }

    const response = await api.patch<{ data: PersonInfo }>(
      `/persons/${graveId}/death-info`,
      deathInfoUpdate
    );

    const updatedPerson = response.data.data;
    const updatedGrave = personToGrave(updatedPerson);

    if (!updatedGrave) {
      throw new Error("Không thể convert person sang grave");
    }

    console.log("✅ Đã cập nhật mộ:", updatedGrave);
    return updatedGrave;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật mộ:", error);
    throw error;
  }
};

export const deleteGraveFromAPI = async (graveId: string): Promise<void> => {
  // Xóa mộ = xóa thông tin death, không xóa person
  try {
    console.log("Đang xóa thông tin mộ...");
    await api.patch(`/persons/${graveId}/death-info`, {
      deathPlace: "",
      gravePlace: "",
    });
    console.log("✅ Đã xóa thông tin mộ");
  } catch (error) {
    console.error("❌ Lỗi khi xóa mộ:", error);
    throw error;
  }
};
