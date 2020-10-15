import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo, FiArrowLeft } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useHistory, useParams } from 'react-router-dom';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/sidebar";
import { mapIcon } from "../utils/icons";
import api from "../services/api";

interface Image{
  id: number;
  path: string;
}

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Image[]
}

interface OrphanageParams{
  id: string
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>()
  const [orphanage, setOrphanage] = useState<Orphanage>()
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
      getOrphanages()
  }, [params.id])

  async function getOrphanages() {
    const { data } = await api.get(`orphanages/${params.id}`)
    setOrphanage(data)  
  }

  const { goBack } = useHistory();

  if(!orphanage){
    return null
  }

  return (
    <div id="page-orphanage">

      <Sidebar /> 

      <main>
        <div className="orphanage-details">
          {!!orphanage.images && 
            <img src={`${orphanage.images[imageIndex].path}`} alt={orphanage.name} />
          }

          <div className="images">
            
            {orphanage.images.map((image, index) => {
              return (
                <button className={imageIndex === index ? 'active' : '' } type="button" onClick={() => setImageIndex(index)}>
                  <img src={image.path} alt={orphanage.name}  />
                </button>
                );
              }
            )}
            
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude,orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>
              
              <footer>
                {/* <a href={`https://www.google.com/maps/dir/?api=1&origin=34.1030032,-118.41046840000001&destination=34.059808,-118.368152`}>Ver rotas no Google Maps</a> */}
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>
                  Ver rotas no Google Maps
                </a>
              </footer>
            
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? 
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
               : 
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF6690" />
                  Não atendemos <br />
                  fim de semana
                </div>
              }

            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
            
          </div>
        </div>
      </main>
    </div>
  );
}