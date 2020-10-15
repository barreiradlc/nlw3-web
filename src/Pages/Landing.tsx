import React from 'react';

import "../styles/pages/landing.css";

import LogoImg from "../images/logo.svg"

import { FiArrowDownRight } from "react-icons/fi";

import { Link } from "react-router-dom";

function App() {
  return (
    <div id="page-landing">
     <div className="content-wrapper">

      <img src={LogoImg} alt="Happy logo"/>

      <main>
        <h1>Leve felicidade para o mundo</h1>
        <p>Visite orfanatos e mude o dia de muitas crianças</p>
      </main>

      <div className="location">
        <strong>Ceilândia</strong>
        <span>Distrito Federal</span>
      </div>

      <Link to="/map" className="enter-app" >
        <FiArrowDownRight size={26} color="rgba(0, 0, 0, 0.6)" />
      </Link>
      {/* link */}

     </div>
    </div>
  );
}

export default App;