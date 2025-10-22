declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

import { env } from "../../config/env";

let mapPromise: Promise<void> | null = null;
let isLoaded = false;
let loadCallbacks: Array<{ resolve: () => void; reject: (error: Error) => void }> = [];

export const loadGoogleMapsAPI = (): Promise<void> => {
  // Nếu đã load thành công trước đó, resolve ngay
  if (isLoaded && window.google?.maps?.Map) {
    console.log("✅ Google Maps API đã sẵn sàng (cached)");
    return Promise.resolve();
  }

  // Nếu đang trong quá trình load, tạo promise mới nhưng cùng queue
  if (mapPromise) {
    console.log("⏳ Đang chờ Google Maps API load...");
    return new Promise((resolve, reject) => {
      loadCallbacks.push({ resolve, reject });
    });
  }

  if (!env.GOOGLE_MAPS_API_KEY) {
    const error = new Error("❌ VITE_GOOGLE_MAPS_API_KEY chưa được cấu hình trong .env");
    console.error(error.message);
    console.warn("💡 Hãy thêm VITE_GOOGLE_MAPS_API_KEY vào file .env hoặc .env.local");
    return Promise.reject(error);
  }

  console.log("🔄 Bắt đầu load Google Maps API...");

  mapPromise = new Promise((resolve, reject) => {
    // Kiểm tra script đã tồn tại chưa
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api"]'
    );

    if (existingScript) {
      console.log("📍 Script Google Maps đã tồn tại");
      
      // Nếu Google Maps đã sẵn sàng, resolve luôn
      if (window.google?.maps?.Map) {
        console.log("✅ Google Maps API đã sẵn sàng!");
        isLoaded = true;
        mapPromise = null;
        resolve();
        // Resolve tất cả callbacks đang chờ
        loadCallbacks.forEach(cb => cb.resolve());
        loadCallbacks = [];
        return;
      }
      
      // Nếu chưa sẵn sàng, đợi callback được gọi
      console.log("⏳ Đợi callback initGoogleMaps...");
      return;
    }

    // Tạo callback function
    window.initGoogleMaps = () => {
      console.log("✅ Callback: Google Maps API đã load!");
      isLoaded = true;
      const tempPromise = mapPromise;
      mapPromise = null;
      
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
      
      resolve();
      // Resolve tất cả callbacks đang chờ
      loadCallbacks.forEach(cb => cb.resolve());
      loadCallbacks = [];
    };

    // Tạo script mới - SỬA: bỏ "directions" library vì nó không tồn tại
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps&loading=async`;
    script.async = true;
    script.defer = true;

    script.onerror = (error) => {
      console.error("❌ Lỗi load Google Maps script:", error);
      mapPromise = null;
      isLoaded = false;
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
      const err = new Error("Không thể load Google Maps API");
      reject(err);
      // Reject tất cả callbacks đang chờ
      loadCallbacks.forEach(cb => cb.reject(err));
      loadCallbacks = [];
    };

    document.head.appendChild(script);
    console.log("📡 Đã thêm script Google Maps vào DOM");
  });

  return mapPromise;
};
