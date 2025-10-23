import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import { Grave } from "./type";
import {
  fetchGravesFromAPI,
  addGraveToAPI,
  deleteGraveFromAPI,
  updateGraveInAPI,
} from "./Cemetery.service";
import { provinceData, getProvinceByCoords } from "./provinces.data";
import {
  Loader,
  AlertCircle,
  Search,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Trash2,
  MapPin,
  PlusSquare,
  Navigation,
  XCircle,
  Plus,
} from "lucide-react";
import { loadGoogleMapsAPI } from "./googleMapsLoader";
import { AddGraveForm } from "./Components/AddGrave";
import { EditableField } from "./Components/Edit";
import {
  vietnamBoundary,
  loadVietnamBoundary,
} from "./Components/VietNamBoundary";
import { isPointInPolygon } from "./utils";
import { useAuth } from "@/components/hooks/useAuth";

const ALL_PROVINCES = "all";
interface MapState {
  isMapApiReady: boolean;
  isDataLoading: boolean;
  error: string | null;
  selectedGrave: Grave | null;
  searchTerm: string;
  filterProvince: string;
  isAddMode: boolean;
  selectedPlace: google.maps.places.PlaceResult | null;
  newGraveForm: {
    isOpen: boolean;
    coords: { lat: number; lng: number } | null;
    province: string | null;
    address: string | null;
  };
  toast: string | null;
  deletingId: string | null;
  isDirectionsVisible: boolean;
}

const initialState: MapState = {
  isMapApiReady: false,
  isDataLoading: true,
  error: null,
  selectedGrave: null,
  searchTerm: "",
  filterProvince: ALL_PROVINCES,
  isAddMode: false,
  selectedPlace: null,
  newGraveForm: { isOpen: false, coords: null, province: null, address: null },
  toast: null,
  deletingId: null,
  isDirectionsVisible: false,
};

type MapAction =
  | { type: "MAP_API_READY" }
  | { type: "DATA_FETCH_SUCCESS" }
  | { type: "DATA_FETCH_ERROR"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SELECT_GRAVE"; payload: Grave | null }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_FILTER_PROVINCE"; payload: string }
  | { type: "TOGGLE_ADD_MODE" }
  | {
      type: "SET_SELECTED_PLACE";
      payload: google.maps.places.PlaceResult | null;
    }
  | {
      type: "OPEN_NEW_GRAVE_FORM";
      payload: Omit<MapState["newGraveForm"], "isOpen">;
    }
  | { type: "CLOSE_NEW_GRAVE_FORM" }
  | { type: "SET_TOAST"; payload: string | null }
  | { type: "SET_DELETING_ID"; payload: string | null }
  | { type: "SET_DIRECTIONS_VISIBLE"; payload: boolean };

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case "MAP_API_READY":
      return { ...state, isMapApiReady: true };
    case "DATA_FETCH_SUCCESS":
      return { ...state, isDataLoading: false };
    case "DATA_FETCH_ERROR":
      return { ...state, isDataLoading: false, error: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SELECT_GRAVE":
      return { ...state, selectedGrave: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_FILTER_PROVINCE":
      return { ...state, filterProvince: action.payload };
    case "TOGGLE_ADD_MODE":
      return {
        ...state,
        isAddMode: !state.isAddMode,
        selectedPlace: null,
      };
    case "SET_SELECTED_PLACE":
      return { ...state, selectedPlace: action.payload };
    case "OPEN_NEW_GRAVE_FORM":
      return {
        ...state,
        newGraveForm: { ...action.payload, isOpen: true },
        isAddMode: false,
      };
    case "CLOSE_NEW_GRAVE_FORM":
      return {
        ...state,
        newGraveForm: {
          isOpen: false,
          coords: null,
          province: null,
          address: null,
        },
        selectedPlace: null,
      };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
    case "SET_DELETING_ID":
      return { ...state, deletingId: action.payload };
    case "SET_DIRECTIONS_VISIBLE":
      return { ...state, isDirectionsVisible: action.payload };
    default:
      return state;
  }
}

const CemeteryMap: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [graves, setGraves] = useState<Grave[]>([]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [state, dispatch] = useReducer(mapReducer, initialState);
  const {
    isMapApiReady,
    isDataLoading,
    error,
    selectedGrave,
    searchTerm,
    filterProvince,
    isAddMode,
    selectedPlace,
    newGraveForm,
    toast,
    deletingId,
    isDirectionsVisible,
  } = state;

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(
    null
  );
  const tempMarkerRef = useRef<google.maps.Marker | null>(null);
  const addressSearchRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  useEffect(() => {
    console.log("🚀 Starting Google Maps API load...");
    loadGoogleMapsAPI()
      .then(() => {
        console.log("✅ Google Maps API loaded successfully, dispatching MAP_API_READY");
        dispatch({ type: "MAP_API_READY" });
      })
      .catch((error) => {
        console.error("❌ Failed to load Google Maps API:", error);
        dispatch({
          type: "DATA_FETCH_ERROR",
          payload: "Lỗi tải Google Maps API.",
        });
      });
  }, []);

  // Fetch graves data khi map API sẵn sàng và user đã authenticated
  useEffect(() => {
    console.log("🔍 Checking conditions - isMapApiReady:", isMapApiReady, "isAuthenticated:", isAuthenticated);
    if (!isMapApiReady) return;
    
    if (!isAuthenticated) {
      console.log("⏸️ Chờ user đăng nhập...");
      dispatch({
        type: "DATA_FETCH_ERROR",
        payload: "Vui lòng đăng nhập để xem bản đồ mộ phần.",
      });
      return;
    }

    console.log("👤 User:", user?.name, "- Đang tải dữ liệu mộ...");
    
    fetchGravesFromAPI()
      .then((data) => {
        setGraves(data);
        dispatch({ type: "DATA_FETCH_SUCCESS" });
      })
      .catch((error) => {
        console.error("Lỗi tải dữ liệu:", error);
        dispatch({
          type: "DATA_FETCH_ERROR",
          payload: "Không thể tải dữ liệu mộ. Vui lòng thử lại.",
        })
      });
  }, [isMapApiReady, isAuthenticated, user]);

  const handleClearDirections = useCallback(() => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }
    if (mapInstanceRef.current && window.google) {
      directionsRendererRef.current =
        new window.google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapInstanceRef.current);
    }
    dispatch({ type: "SET_DIRECTIONS_VISIBLE", payload: false });
  }, [dispatch]);

  const handlePlaceSelected = useCallback(() => {
    const map = mapInstanceRef.current;
    const autocomplete = autocompleteRef.current;
    if (!map || !autocomplete) return;

    handleClearDirections();
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      dispatch({ type: "SET_SELECTED_PLACE", payload: null });
      return;
    }
    dispatch({ type: "SET_SELECTED_PLACE", payload: place });

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.panTo(place.geometry.location);
      map.setZoom(17);
    }
  }, [dispatch, handleClearDirections]);

  useEffect(() => {
    console.log("🗺️ Map init useEffect - isMapApiReady:", isMapApiReady, "mapDivRef.current:", !!mapDivRef.current, "mapInstanceRef.current:", !!mapInstanceRef.current);
    
    if (!isMapApiReady || mapInstanceRef.current) return;
    
    // Retry logic: wait for mapDivRef to be available
    const initMap = () => {
      if (!mapDivRef.current) {
        console.log("⏳ mapDivRef not ready yet, retrying in 50ms...");
        setTimeout(initMap, 50);
        return;
      }
      
      console.log("🗺️ Đang khởi tạo map...");
      const map = new window.google.maps.Map(mapDivRef.current, {
        center: { lat: 16.047079, lng: 108.20623 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new window.google.maps.InfoWindow();
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current =
        new window.google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);
      
      console.log("✅ Map đã khởi tạo xong, setting isMapInitialized = true");
      // Mark map as initialized to trigger markers creation
      setIsMapInitialized(true);

      loadVietnamBoundary().catch((err) => {
        console.error("❌ Lỗi khi tải biên giới Việt Nam:", err);
      });

      if (addressSearchRef.current) {
        const defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(8.18, 102.14),
          new google.maps.LatLng(23.39, 109.46)
        );
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressSearchRef.current,
          {
            bounds: defaultBounds,
            componentRestrictions: { country: "vn" },
            types: ["geocode", "establishment"],
            fields: ["geometry", "name", "formatted_address"],
          }
        );
        autocompleteRef.current = autocomplete;
        autocomplete.addListener("place_changed", () => {
          const map = mapInstanceRef.current;
          const autocomplete = autocompleteRef.current;
          if (!map || !autocomplete) return;

          handleClearDirections();
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            dispatch({ type: "SET_SELECTED_PLACE", payload: null });
            return;
          }
          dispatch({ type: "SET_SELECTED_PLACE", payload: place });

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.panTo(place.geometry.location);
            map.setZoom(17);
          }
        });
      }
    };
    
    initMap();
  }, [isMapApiReady, dispatch, handleClearDirections]);

  const handleShowDirections = useCallback(
    (grave: Grave) => {
      if (
        !navigator.geolocation ||
        !directionsServiceRef.current ||
        !directionsRendererRef.current
      ) {
        dispatch({
          type: "SET_TOAST",
          payload: "Trình duyệt không hỗ trợ chỉ đường.",
        });
        return;
      }
      infoWindowRef.current?.close();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          handleClearDirections();
          dispatch({ type: "SET_TOAST", payload: "Đang tìm đường đi..." });

          const request: google.maps.DirectionsRequest = {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: grave.coordinates,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsServiceRef.current?.route(request, (response, status) => {
            if (status === "OK" && directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(response);
              dispatch({ type: "SET_DIRECTIONS_VISIBLE", payload: true });
              dispatch({ type: "SET_TOAST", payload: null });
            } else {
              dispatch({
                type: "SET_TOAST",
                payload: "Không thể tìm thấy đường đi.",
              });
              dispatch({ type: "SET_DIRECTIONS_VISIBLE", payload: false });
            }
          });
        },
        () => {
          dispatch({
            type: "SET_TOAST",
            payload: "Không thể lấy vị trí của bạn.",
          });
        }
      );
    },
    [dispatch, handleClearDirections]
  );

  const handleGraveClick = useCallback(
    (grave: Grave) => {
      dispatch({ type: "SELECT_GRAVE", payload: grave });
      const map = mapInstanceRef.current;
      const info = infoWindowRef.current;
      const marker = markersRef.current[grave.id];
      if (!map || !info || !marker) return;

      const infoContent = `
        <div style="font-family: Arial, sans-serif; padding: 5px;">
          <strong style="font-size: 1.1em; display: block; margin-bottom: 5px;">${grave.name}</strong>
          <button id="info-window-directions-btn" style="color: #007bff; border: none; padding: 0; background: none; cursor: pointer;">
            Chỉ đường
          </button>
        </div>`;
      info.setContent(infoContent);

      google.maps.event.clearListeners(info, "domready");
      info.addListener("domready", () => {
        document
          .getElementById("info-window-directions-btn")
          ?.addEventListener("click", () => {
            handleShowDirections(grave);
          });
      });

      info.open({ anchor: marker, map });
      map.panTo(grave.coordinates);
    },
    [dispatch, handleShowDirections]
  );

  useEffect(() => {
    const map = mapInstanceRef.current;
    console.log("🔄 Markers useEffect triggered:", {
      hasMap: !!map,
      gravesCount: graves.length,
      isMapInitialized,
    });
    
    if (!map || graves.length === 0 || !isMapInitialized) {
      console.log("⏭️ Skipping markers creation");
      return;
    }

    console.log("🎯 Creating markers for", graves.length, "graves");
    Object.values(markersRef.current).forEach((m) => m.setMap(null));
    markersRef.current = {};

    graves.forEach((grave) => {
      const marker = new window.google.maps.Marker({
        position: grave.coordinates,
        title: grave.name,
        map,
        visible: true,
      });
      marker.addListener("click", () => handleGraveClick(grave));
      markersRef.current[grave.id] = marker;
    });
    console.log("✅ Created", Object.keys(markersRef.current).length, "markers");
  }, [graves, isMapInitialized, handleGraveClick]);

  const filteredGraves = useMemo(() => {
    const filtered = graves.filter(
      (g) =>
        (g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.relation.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterProvince === ALL_PROVINCES ||
          g.location.province === filterProvince)
    );
    return new Set(filtered.map((g) => g.id));
  }, [graves, searchTerm, filterProvince]);

  useEffect(() => {
    for (const graveId in markersRef.current) {
      const marker = markersRef.current[graveId];
      if (filteredGraves.has(graveId)) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    }
  }, [filteredGraves]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isAddMode && !selectedPlace) {
      mapClickListenerRef.current = map.addListener(
        "click",
        async (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            handleClearDirections();
            const clicked = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            const province = getProvinceByCoords(clicked.lat, clicked.lng);
            let formattedAddress = "Không tìm thấy địa chỉ";

            try {
              if (window.google && window.google.maps) {
                const geocoder = new window.google.maps.Geocoder();
                const response = await geocoder.geocode({ location: clicked });
                if (response.results && response.results[0]) {
                  formattedAddress = response.results[0].formatted_address;
                }
              }
            } catch (error) {
              console.error("Lỗi Geocoding:", error);
            }

            if (tempMarkerRef.current) tempMarkerRef.current.setMap(null);
            tempMarkerRef.current = new window.google.maps.Marker({
              position: clicked,
              map,
              icon: "http://googleusercontent.com/maps/google.com/0",
            });

            dispatch({
              type: "OPEN_NEW_GRAVE_FORM",
              payload: {
                coords: clicked,
                province: province || "Không xác định",
                address: formattedAddress,
              },
            });
          }
        }
      );
    } else if (mapClickListenerRef.current) {
      mapClickListenerRef.current.remove();
      mapClickListenerRef.current = null;
    }

    return () => {
      if (mapClickListenerRef.current) {
        mapClickListenerRef.current.remove();
      }
    };
  }, [dispatch, isAddMode, selectedPlace, handleClearDirections]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(
      () => dispatch({ type: "SET_TOAST", payload: null }),
      3000
    );
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  const handleAddFromSelectedPlace = useCallback(() => {
    if (
      !selectedPlace ||
      !selectedPlace.geometry ||
      !selectedPlace.geometry.location
    )
      return;

    handleClearDirections();
    const coords = {
      lat: selectedPlace.geometry.location.lat(),
      lng: selectedPlace.geometry.location.lng(),
    };
    const province =
      getProvinceByCoords(coords.lat, coords.lng) || "Không xác định";
    const address =
      selectedPlace.formatted_address ||
      selectedPlace.name ||
      "Không rõ địa chỉ";

    dispatch({
      type: "OPEN_NEW_GRAVE_FORM",
      payload: { coords, province, address },
    });
  }, [dispatch, selectedPlace, handleClearDirections]);

  const handleAddNewGrave = useCallback(
    async (personId: string, coords: { lat: number; lng: number }, address: string) => {
      try {
        // Call API to update death info
        const updatedPerson = await addGraveToAPI(personId, coords, address);
        
        // Reload graves data to show the newly added grave
        const updatedGraves = await fetchGravesFromAPI();
        setGraves(updatedGraves);
        
        dispatch({ type: "CLOSE_NEW_GRAVE_FORM" });
        if (tempMarkerRef.current) {
          tempMarkerRef.current.setMap(null);
          tempMarkerRef.current = null;
        }
        if (addressSearchRef.current) addressSearchRef.current.value = "";
        dispatch({ type: "SET_TOAST", payload: "Đã cập nhật thông tin mộ thành công!" });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      }
    },
    [dispatch]
  );

  const handleDeleteGrave = useCallback(
    async (id: string) => {
      if (deletingId) return;
      if (!window.confirm("Bạn có chắc chắn muốn xóa ngôi mộ này không?"))
        return;
      dispatch({ type: "SET_DELETING_ID", payload: id });
      try {
        await deleteGraveFromAPI(id);
        setGraves((prev) => prev.filter((g) => g.id !== id));
        if (selectedGrave?.id === id)
          dispatch({ type: "SELECT_GRAVE", payload: null });
        dispatch({ type: "SET_TOAST", payload: "Đã xóa mộ thành công!" });
        handleClearDirections();
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      } finally {
        dispatch({ type: "SET_DELETING_ID", payload: null });
      }
    },
    [dispatch, deletingId, selectedGrave, handleClearDirections]
  );

  const handleUpdateGrave = useCallback(
    async (graveId: string, field: "name" | "relation", value: string) => {
      try {
        const updated = await updateGraveInAPI(graveId, { [field]: value });
        setGraves((prev) => prev.map((g) => (g.id === graveId ? updated : g)));
        if (selectedGrave?.id === graveId)
          dispatch({ type: "SELECT_GRAVE", payload: updated });
        dispatch({ type: "SET_TOAST", payload: "Cập nhật thành công!" });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      }
    },
    [dispatch, selectedGrave]
  );

  const handleZoom = useCallback((delta: number) => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom((map.getZoom() || 6) + delta);
  }, []);

  const handleFitBounds = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || filteredGraves.size === 0) return;

    handleClearDirections();
    const bounds = new window.google.maps.LatLngBounds();
    graves.forEach((g) => {
      if (filteredGraves.has(g.id)) {
        bounds.extend(g.coordinates);
      }
    });
    map.fitBounds(bounds);
  }, [filteredGraves, graves, handleClearDirections]);

  //  Render UI

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="ml-4 text-red-700">{error}</p>
      </div>
    );

  if (!isMapApiReady || isDataLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-gray-700">Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-[1002]">
          {toast}
        </div>
      )}

      {isAddMode && !selectedPlace && (
        <div className="fixed top-0 left-0 right-0 pt-4 flex justify-center z-[1001] pointer-events-none">
          <div className="bg-white px-6 py-3 rounded shadow-lg text-blue-700 font-semibold border border-blue-500">
            Nhấp vào bản đồ để chọn vị trí thêm mộ
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* === Sidebar (Thanh bên trái) === */}
          <div className="w-full lg:w-[400px] bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="p-4 border-b">
              {/* Lọc Tỉnh */}
              <div className="flex justify-end items-center mb-4">
                <select
                  value={filterProvince}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FILTER_PROVINCE",
                      payload: e.target.value,
                    })
                  }
                  className="border rounded px-2 py-2 text-sm"
                >
                  <option value={ALL_PROVINCES}>Tất cả tỉnh/thành</option>
                  {provinceData.map((p) => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thanh tìm kiếm địa chỉ */}
              <div className="relative mb-3">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={addressSearchRef}
                  type="text"
                  placeholder="Tìm địa chỉ trên bản đồ..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-blue-500"
                  disabled={isAddMode}
                  onChange={(e) => {
                    if (selectedPlace) {
                      dispatch({ type: "SET_SELECTED_PLACE", payload: null });
                    }
                  }}
                />
              </div>

              {/* Nút thêm từ địa điểm đã chọn */}
              {selectedPlace && (
                <div className="mb-3">
                  <button
                    onClick={handleAddFromSelectedPlace}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-600"
                  >
                    <PlusSquare size={16} />
                    Thêm mộ tại: {selectedPlace.name}
                  </button>
                </div>
              )}

              {/* Thanh tìm kiếm người thân */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc quan hệ..."
                  value={searchTerm}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SEARCH_TERM",
                      payload: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Danh sách người thân (có thể cuộn) */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-340px)]">
              {filteredGraves.size > 0 ? (
                graves
                  .filter((g) => filteredGraves.has(g.id))
                  .map((grave) => (
                    <div
                      key={grave.id}
                      className={`mb-3 p-3 rounded-lg shadow-sm border flex items-center gap-3 cursor-pointer ${
                        selectedGrave?.id === grave.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleGraveClick(grave)}
                    >
                      <div className="flex-1">
                        <div className="font-bold">
                          <EditableField
                            initialValue={grave.name}
                            onSave={(val) =>
                              handleUpdateGrave(grave.id, "name", val)
                            }
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          <EditableField
                            initialValue={grave.relation}
                            onSave={(val) =>
                              handleUpdateGrave(grave.id, "relation", val)
                            }
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {grave.location.province}
                        </div>
                      </div>
                      <button
                        className="ml-2 p-2 rounded-full hover:bg-blue-100"
                        title="Chỉ đường"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowDirections(grave);
                        }}
                      >
                        <Navigation className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        className="ml-2 p-2 rounded-full hover:bg-red-100 disabled:opacity-50"
                        title="Xóa mộ"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGrave(grave.id);
                        }}
                        disabled={deletingId !== null}
                      >
                        {deletingId === grave.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Không tìm thấy mộ phù hợp.
                </div>
              )}
            </div>
          </div>

          {/* === Bản đồ === */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden relative h-full">
              {/* Nút điều khiển Zoom/Fit */}
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <button
                  className="px-3 py-2 rounded bg-white shadow hover:bg-gray-100"
                  onClick={() => handleZoom(1)}
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  className="px-3 py-2 rounded bg-white shadow hover:bg-gray-100"
                  onClick={() => handleZoom(-1)}
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  className="px-3 py-2 rounded bg-white shadow hover:bg-gray-100"
                  onClick={handleFitBounds}
                >
                  <LocateFixed size={18} />
                </button>
                {isDirectionsVisible && (
                  <button
                    className="px-3 py-2 rounded bg-white shadow hover:bg-gray-100 text-red-500"
                    onClick={handleClearDirections}
                    title="Xóa đường đi"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>

              {/* Nút Thêm Mộ Mới trên bản đồ */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  className={`px-3 py-2 rounded bg-white shadow hover:bg-gray-100 ${
                    isAddMode ? "text-red-500" : "text-blue-500"
                  }`}
                  onClick={() => {
                    dispatch({ type: "TOGGLE_ADD_MODE" });
                    if (addressSearchRef.current)
                      addressSearchRef.current.value = "";
                  }}
                  title={
                    isAddMode ? "Hủy Thêm" : "Thêm Mộ Mới (Nhấp vào bản đồ)"
                  }
                >
                  {isAddMode ? <XCircle size={18} /> : <Plus size={18} />}
                </button>
              </div>

              {/* Div chứa bản đồ Google */}
              <div
                ref={mapDivRef}
                style={{
                  height: "calc(100vh - 100px)",
                  minHeight: "600px",
                  width: "100%",
                }}
                className={
                  isAddMode && !selectedPlace ? "cursor-crosshair" : ""
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form thêm mộ (Modal) */}
      {newGraveForm.isOpen &&
        newGraveForm.coords &&
        newGraveForm.province &&
        newGraveForm.address && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
            <AddGraveForm
              coords={newGraveForm.coords}
              province={newGraveForm.province}
              address={newGraveForm.address}
              onSave={handleAddNewGrave}
              onClose={() => {
                dispatch({ type: "CLOSE_NEW_GRAVE_FORM" });
                if (tempMarkerRef.current) {
                  tempMarkerRef.current.setMap(null);
                  tempMarkerRef.current = null;
                }
                if (addressSearchRef.current)
                  addressSearchRef.current.value = "";
              }}
            />
          </div>
        )}
    </div>
  );
};

export default CemeteryMap;
