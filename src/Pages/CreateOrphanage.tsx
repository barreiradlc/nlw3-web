import React, { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import L, { LatLng, LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";

import { FiArrowLeft, FiPlus } from "react-icons/fi";

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/create-orphanage.css';
import api from "../services/api";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})


interface Image {
  id: number;
  path: string;
}

interface Orphanage {
  name?: string;
  latitude?: number;
  longitude?: number;
  about?: string;
  instructions?: string;
  opening_hours?: string;
  open_on_weekends?: boolean;
  images?: Image[]
}


export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })
  const [values, setValues] = useState<Orphanage>();
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const { goBack} = useHistory();
  const history = useHistory();

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng
    })

  }

  function setInput(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>) {
    const { id, value } = event.currentTarget
    setValues({ ...values, [id]: value })
  }

  async function handleSubmit(event: FormEvent) {
    const data = {
      ...values,
      ...position
    }

    const formDataDTO = new FormData();

    formDataDTO.append('name', String(values?.name || ""))
    formDataDTO.append('about', String(values?.about || ""))
    formDataDTO.append('instructions', String(values?.instructions || ""))
    formDataDTO.append('opening_hours', String(values?.opening_hours || ""))
    formDataDTO.append('open_on_weekends', String(values?.open_on_weekends || ""))
    formDataDTO.append('latitude', String(position.latitude))
    formDataDTO.append('longitude', String(position.longitude))
    
    images.forEach(image => {
      formDataDTO. append('images', image)
    })

    await api.post("/orphanages", formDataDTO)

    alert("Cadastro bem sucedido!")

    history.push("/map")
  }

  function handleSelectImages(event: React.ChangeEvent<HTMLInputElement>){

    if(!event.target.files) return;
    
    const selectedImages = Array.from(event.target.files)
    
    setImages(selectedImages)

    const selectedImagesPreview =  selectedImages.map( image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  return (
    <div id="page-create-orphanage">
      <aside>
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={24} color="#FFF" />
          </button>
        </footer>
      </aside>

      <main>
        <form className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              onclick={handleMapClick}
              center={[-15.8429902, -48.1101308]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 &&
                <Marker interactive={false} icon={happyMapIcon} position={[position.latitude, position.longitude]} />
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input onChange={setInput} id="name" />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" onChange={setInput} maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => {
                  return <img key={image} src={image} alt={image} />
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
            </div>

            <input type="file" multiple onChange={handleSelectImages} id="image[]"/>

          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" onChange={setInput} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Nome</label>
              <input id="opening_hours" onChange={setInput} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button onClick={setInput} id="open_on_weekends" value="true" type="button" className={values?.open_on_weekends ? "active" : ""}>Sim</button>
                <button onClick={setInput} id="open_on_weekends" value="false" type="button" className={!values?.open_on_weekends ? "active" : ""}>Não</button>
              </div>
            </div>
          </fieldset>

          <button onClick={handleSubmit} className="confirm-button" type="button">
            Confirmar
          </button>
        </form>

        {JSON.stringify(previewImages)}

      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
