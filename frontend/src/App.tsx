import { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { MapSidebar } from './components/MapSidebar';
import { MapArea } from './components/MapArea';
import { DetailDrawer } from './components/DetailDrawer';
import { AddGraveModal } from './components/AddGraveModal';

// Removed stray code-fence markers
export default function App() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // separate state for enabling "click on map to add" mode
  const [mapAddMode, setMapAddMode] = useState(false);
  const [addCoords, setAddCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarkerId(marker.id);
    setIsDetailDrawerOpen(true);
  };

  const handleSelectGrave = (grave: any) => {
    setSelectedMarkerId(grave.id);
    setIsDetailDrawerOpen(true);
  };

  const handleAddGrave = () => {
    // Enable map click mode: user should click on the map to pick coordinates.
    setAddCoords(null); // reset any previous coords
    setMapAddMode(true);
  };

  const handleCloseDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedMarkerId(null);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F6F6F7]">
      {/* Header */}
      <HeaderNav />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <MapSidebar 
          onAddGrave={handleAddGrave}
          onSelectGrave={handleSelectGrave}
        />
        
        {/* Map Area */}
        <MapArea 
          onMarkerClick={handleMarkerClick}
          selectedMarkerId={selectedMarkerId}
          addMode={mapAddMode}
          onMapClick={(latlng) => {
            // when map reports a click while in add mode, capture coords, disable add mode and open modal
            setAddCoords(latlng);
            setMapAddMode(false);
            setIsAddModalOpen(true);
          }}
          selectedAddCoords={addCoords}
          refreshSignal={refreshSignal}
        />
        
        {/* Detail Drawer */}
        <DetailDrawer
          isOpen={isDetailDrawerOpen}
          onClose={handleCloseDrawer}
          graveId={selectedMarkerId}
        />
      </div>

      {/* Add Grave Modal */}
      <AddGraveModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialCoords={addCoords}
        onSaved={() => {
          setIsAddModalOpen(false);
          setAddCoords(null);
          setRefreshSignal((s: number) => s + 1);
        }}
      />
    </div>
  );
}