import relatorioImage from "../../public/images/banner-rel-2.png";
import "../components/styles/RelatorioImagem.css"

const RelatorioImagem = () => {
  return (
    <div className="relatorio-imagem">
      <img src={relatorioImage} alt="Imagem do Relatório" />
    </div>
  );
};

export default RelatorioImagem;
