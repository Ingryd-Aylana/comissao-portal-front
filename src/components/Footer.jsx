import React from "react";
import { FaFacebookF , FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import "../components/styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Bloco da Logo e Descrição */}
        <div className="footer-section">
        <img src="/images/logo2.png" alt="Fedcorp Logo" className="logo-img" />
        </div>

        {/* Contato RJ */}
        <div className="footer-section">
          <h3>Rio de Janeiro</h3>
          <p><FaPhoneAlt /> (21) 2516-6001</p>
          <p><FaEnvelope /> sac@grupofedcorp.com.br</p>
          <p>
            <FaMapMarkerAlt />
            Rua da Alfândega, 108, 7º andar - Centro - Rio de Janeiro/RJ
          </p>
        </div>

        {/* Contato SP */}
        <div className="footer-section">
          <h3>São Paulo</h3>
          <p><FaPhoneAlt /> (11) 4117-9979</p>
          <p><FaEnvelope /> sacsp@grupofedcorp.com.br</p>
          <p>
            <FaMapMarkerAlt />
            Rua Coronel Oscar Porto, 800 - Vila Mariana - São Paulo/SP
          </p>
        </div>

        {/* Redes Sociais */}
        <div className="footer-section">
          <h3>Redes Sociais</h3>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/GrupoFedcorp/?locale=pt_BR"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/grupofedcorp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/grupofedcorp/"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-linkedin"
            >
              <SiLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Desenvolvido por Grupo Fedcorp Desenvolvimento e Tecnologia © 2025
        </p>
        <a
          href="https://wa.me/552125166001"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-icon"
        >
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
}