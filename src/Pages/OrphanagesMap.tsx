import React, { useEffect, useState } from "react";
import "../styles/pages/orphanages-map-page.css"

import { Link } from "react-router-dom";
import { FiArrowRight, FiPlus } from "react-icons/fi";

import MapMarkerImg from "../images/map-marker.svg"

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import Leaflet from "leaflet";
import api from "../services/api";

const mapIcon = Leaflet.icon({
    iconUrl: MapMarkerImg,

    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [175, 10]
})

interface Orphanage {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: boolean;
}

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useEffect(() => {
        getOrphanages()
    }, [])

    async function getOrphanages() {
        try {
            const { data } = await api.get('orphanages')
            setOrphanages(data)
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={MapMarkerImg} alt="Happy" />

                    <h2>Escolha um orfanato no Mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita</p>
                </header>

                <footer>
                    <strong>Ceilândia</strong>
                    <span>Distrito Federal</span>
                </footer>
            </aside>

            <Map
                center={[-15.8429902, -48.1101308]}
                zoom={15}
                style={{ width: "100%", height: "100%" }}
            >

                {orphanages.map(orphanage => 

                    <Marker
                        key={orphanage.id}
                        icon={mapIcon}
                        position={[orphanage.latitude, orphanage.longitude]}
                    >
                        <Popup closeButton={false} minWidth={240} className="map-popup">
                            {orphanage.name}
                        <Link to={`/orphanages/${orphanage.id}`}>
                                <FiArrowRight size={20} color="#fff " />
                            </Link>
                        </Popup>
                    </Marker>

                )}

                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
            </Map>

            <Link to="orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#fff" />
            </Link>
        </div>
    );
}

export default OrphanagesMap;