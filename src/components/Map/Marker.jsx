import React from "react";
import { Marker } from "react-mapbox-gl";
import markerUrl from "../../images/logo192.png";
import "./Marker.css";

const CustomMarker = ({ coordinates, showSidebar }) => {
  return (
    <Marker
      coordinates={coordinates}
      anchor="bottom"
      onClick={(e) => {
        showSidebar(e);
      }}
      className="marker"
    >
      <img src={markerUrl} alt="marker" />
    </Marker>
  );
};

export default CustomMarker;
