import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import BAModal from "./BAModal";

// Define a type for the coordinate object
interface Coordinates {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "500px",
};

const Map = (props: any) => {
  const { cordinate, openMap, setOpenMap,values } = props;
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  // const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  // const [searchInput, setSearchInput] = useState("");
  const [long, setLong] = useState({
    
      lat: 24.861557475359678,
      lng: 67.00484275817871,
    
  });
  console.log(setLong);

// const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
//   setAutocomplete(autocomplete);
// };

// const onPlaceChanged = () => {
//   if (!autocomplete) return;
//   const place = autocomplete.getPlace();
//   if (place.geometry?.location) {
//     const lat = place.geometry.location.lat();
//     const lng = place.geometry.location.lng();
//     setSelectedLocation({ lat, lng });
//     cordinate({ lat, lng });
//   }
// };

const handleMapClick = (event: google.maps.MapMouseEvent) => {
  if (event.latLng) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    cordinate({ lat, lng });
  }
};
useEffect(() => {
  if (values) {
    const parts = String(values)
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      const lat = Number(parts[0]);
      const lng = Number(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setSelectedLocation({ lat, lng });
      }
    }
  }
}, [] )
return (
  <LoadScript googleMapsApiKey="AIzaSyCo9hCQYojipCEqqeJP7yx14Ie_6L8aC2U" libraries={["places"]}>
    <BAModal
      width={900}
      open={openMap}
      close={() => setOpenMap(false)}
      title="Find Location"
      content={
        <div style={{ position: "relative" }}>
          {/* <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} options={{ types: ["geocode"] }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search a location"
              style={{
                width: "240px",
                height: "32px",
                padding: "0 12px",
                borderRadius: "3px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                fontSize: "14px",
                outline: "none",
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            />
          </Autocomplete> */}

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={selectedLocation || long}
            zoom={10}
            onClick={handleMapClick}
            
          >
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </div>
      }
    />
  </LoadScript>
);
};

export default Map;
