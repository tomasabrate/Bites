import React from 'react';
import { Map, Marker } from "pigeon-maps";

const Mapa = () => {
  return (
    <Map defaultCenter={[-31.42857647241912, -64.18482463888431]} defaultZoom={17}>
      <Marker 
      width={50} 
      anchor={[-31.42857647241912, -64.18482463888431]} />
    </Map>
  );
};

export default Mapa;