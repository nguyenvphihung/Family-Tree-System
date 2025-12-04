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
import "./CemeteryMap.css";

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

  // Store graves IDs to detect actual changes
  const gravesIdsRef = useRef<string>("");

  useEffect(() => {
    loadGoogleMapsAPI()
      .then(() => {
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
    if (!isMapApiReady) return;

    if (!isAuthenticated) {
      dispatch({
        type: "DATA_FETCH_ERROR",
        payload: "Vui lòng đăng nhập để xem bản đồ mộ phần.",
      });
      return;
    }

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
    if (!isMapApiReady || mapInstanceRef.current) return;

    // Retry logic: wait for mapDivRef to be available
    const initMap = () => {
      if (!mapDivRef.current) {
        setTimeout(initMap, 50);
        return;
      }

      const map = new window.google.maps.Map(mapDivRef.current, {
        center: { lat: 16.047079, lng: 108.20623 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        zoomControl: true,
        clickableIcons: false,
        // Bỏ mapId để dùng Raster rendering (có thể mượt hơn trên một số máy)
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new window.google.maps.InfoWindow();
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current =
        new window.google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);

      // Mark map as initialized to trigger markers creation
      setIsMapInitialized(true);

      // TODO: Vietnam boundary có thể gây lag - tạm thời disable
      // loadVietnamBoundary().catch((err) => {
      //   console.error("❌ Lỗi khi tải biên giới Việt Nam:", err);
      // });

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
    if (!map || graves.length === 0 || !isMapInitialized) return;

    // Kiểm tra xem graves có thực sự thay đổi không (so sánh IDs)
    const currentGravesIds = graves.map(g => g.id).sort().join(',');
    if (gravesIdsRef.current === currentGravesIds) {
      // Graves không thay đổi, không cần re-create markers
      return;
    }
    gravesIdsRef.current = currentGravesIds;

    // Chỉ tạo/xóa markers khi graves thực sự thay đổi
    Object.values(markersRef.current).forEach((m) => m.setMap(null));
    markersRef.current = {};

    graves.forEach((grave) => {
      const marker = new window.google.maps.Marker({
        position: grave.coordinates,
        title: grave.name,
        map,
        visible: true,
        optimized: true,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#4a5568" stroke="#ffffff" stroke-width="2"/>
              <text x="20" y="28" font-size="22" text-anchor="middle" fill="#ffffff">🪦</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        },
      });

      // Inline click handler - không dùng callback để tránh re-render
      marker.addListener("click", () => {
        dispatch({ type: "SELECT_GRAVE", payload: grave });
        const info = infoWindowRef.current;
        if (!info || !marker) return;

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
          const btn = document.getElementById("info-window-directions-btn");
          if (btn) {
            btn.addEventListener("click", () => {
              // Inline directions logic
              if (!navigator.geolocation || !directionsServiceRef.current || !directionsRendererRef.current) {
                dispatch({ type: "SET_TOAST", payload: "Trình duyệt không hỗ trợ chỉ đường." });
                return;
              }
              info.close();

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const origin = { lat: position.coords.latitude, lng: position.coords.longitude };

                  // Clear old directions
                  if (directionsRendererRef.current) {
                    directionsRendererRef.current.setMap(null);
                    directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
                    directionsRendererRef.current.setMap(map);
                  }

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
                      dispatch({ type: "SET_TOAST", payload: "Không thể tìm thấy đường đi." });
                      dispatch({ type: "SET_DIRECTIONS_VISIBLE", payload: false });
                    }
                  });
                },
                () => {
                  dispatch({ type: "SET_TOAST", payload: "Không thể lấy vị trí của bạn." });
                }
              );
            });
          }
        });

        info.open({ anchor: marker, map });
        map.panTo(grave.coordinates);
      });

      markersRef.current[grave.id] = marker;
    });
  }, [graves, isMapInitialized, dispatch]); // CHỈ phụ thuộc vào graves và isMapInitialized

  const filteredGraves = useMemo(() => {
    const filtered = graves.filter((g) => {
      const name = g.name?.toLowerCase() ?? "";
      const relation = g.relation?.toLowerCase?.() ?? ""; // safe check

      return (
        (name.includes(searchTerm.toLowerCase()) ||
          relation.includes(searchTerm.toLowerCase())) &&
        (filterProvince === ALL_PROVINCES ||
          g.location.province === filterProvince)
      );
    });
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
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
                    <text x="20" y="28" font-size="22" text-anchor="middle" fill="#ffffff">📍</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 40),
              },
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
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">Lỗi tải bản đồ</h2>
          <p className="text-red-700 mb-6">{error}</p>
          {error.includes("RefererNotAllowedMapError") && (
            <div className="bg-white p-6 rounded-lg shadow-md text-left">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Cách khắc phục:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Vào <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>Chọn <strong>APIs & Services → Credentials</strong></li>
                <li>Chọn API key đang sử dụng</li>
                <li>Thêm domain sau vào <strong>HTTP referrers</strong>:</li>
              </ol>
              <div className="mt-3 bg-gray-100 p-3 rounded font-mono text-xs">
                http://localhost:5173/*<br />
                http://localhost:5174/*<br />
                http://127.0.0.1:5173/*<br />
                http://127.0.0.1:5174/*
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Tải lại trang
          </button>
        </div>
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-center h-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 text-sm">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Trang chủ
              </a>
              <span className="text-gray-500">/</span>
              <span className="text-white font-medium">Bản đồ nghĩa trang</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast notification with animation */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-[1002] slide-in">
          {toast}
        </div>
      )}

      {/* Add mode indicator with bounce animation */}
      {isAddMode && !selectedPlace && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1001] pointer-events-none">
          <div className="bg-white px-6 py-3 rounded-lg shadow-xl text-rose-600 font-semibold border-2 border-rose-500 bounce-slow">
            <MapPin className="inline-block w-5 h-5 mr-2 -mt-0.5" />
            Nhấp vào bản đồ để chọn vị trí thêm mộ
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Header */}


        <div className="flex flex-col lg:flex-row gap-6">
          {/* === Sidebar === */}
          <div className="w-full lg:w-[420px] space-y-4">
            {/* Search & Filter Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-rose-600" />
                Tìm kiếm & Lọc
              </h2>

              {/* Province Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tỉnh/Thành phố
                </label>
                <select
                  value={filterProvince}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FILTER_PROVINCE",
                      payload: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value={ALL_PROVINCES}>Tất cả tỉnh/thành</option>
                  {provinceData.map((p) => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={addressSearchRef}
                    type="text"
                    placeholder="Nhập địa chỉ để tìm trên bản đồ..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    disabled={isAddMode}
                    onChange={(e) => {
                      if (selectedPlace) {
                        dispatch({ type: "SET_SELECTED_PLACE", payload: null });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Add from selected place button */}
              {selectedPlace && (
                <div className="mb-4">
                  <button
                    onClick={handleAddFromSelectedPlace}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <PlusSquare size={18} />
                    Thêm mộ tại: {selectedPlace.name}
                  </button>
                </div>
              )}

              {/* Person Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm người thân
                </label>
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Graves List Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    Danh sách mộ phần
                  </span>
                  <span className="text-sm font-normal text-gray-500">
                    {filteredGraves.size} mộ
                  </span>
                </h2>
              </div>

              {/* Graves List */}
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-520px)] custom-scrollbar">
                {filteredGraves.size > 0 ? (
                  <div className="space-y-3">
                    {graves
                      .filter((g) => filteredGraves.has(g.id))
                      .map((grave) => (
                        <div
                          key={grave.id}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedGrave?.id === grave.id
                            ? "border-rose-500 bg-rose-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                            }`}
                          onClick={() => handleGraveClick(grave)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 mb-1">
                                <EditableField
                                  initialValue={grave.name}
                                  onSave={(val) =>
                                    handleUpdateGrave(grave.id, "name", val)
                                  }
                                />
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                <EditableField
                                  initialValue={grave.relation}
                                  onSave={(val) =>
                                    handleUpdateGrave(grave.id, "relation", val)
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {grave.location.province}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Chỉ đường"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowDirections(grave);
                                }}
                              >
                                <Navigation className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
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
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Không tìm thấy mộ phù hợp</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === Bản đồ === */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
              {/* Map Controls */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                  className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                  onClick={() => handleZoom(1)}
                  title="Phóng to"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                  onClick={() => handleZoom(-1)}
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                  onClick={handleFitBounds}
                  title="Hiển thị tất cả"
                >
                  <LocateFixed className="w-5 h-5 text-gray-700" />
                </button>
                {isDirectionsVisible && (
                  <button
                    className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-red-50 transition-all"
                    onClick={handleClearDirections}
                    title="Xóa đường đi"
                  >
                    <XCircle className="w-5 h-5 text-red-600" />
                  </button>
                )}
              </div>

              {/* Add Grave Button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  className={`px-5 py-3 rounded-lg shadow-md hover:shadow-lg font-semibold transition-all flex items-center gap-2 ${isAddMode
                    ? "bg-white text-red-600 hover:bg-gray-50"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    dispatch({ type: "TOGGLE_ADD_MODE" });
                    if (addressSearchRef.current)
                      addressSearchRef.current.value = "";
                  }}
                  title={
                    isAddMode ? "Hủy thêm mộ" : "Thêm mộ mới (nhấp vào bản đồ)"
                  }
                >
                  {isAddMode ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      Hủy
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Thêm mộ
                    </>
                  )}
                </button>
              </div>

              {/* Map Container */}
              <div
                ref={mapDivRef}
                style={{
                  height: "calc(100vh - 100px)",
                  minHeight: "600px",
                  width: "100%",
                  // Chỉ dùng position relative để tách layer
                  position: "relative",
                  cursor: isAddMode && !selectedPlace ? "crosshair" : "default",
                }}
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

export default React.memo(CemeteryMap);
