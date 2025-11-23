import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import P1 from "../assets/frd.gif";
import P2 from "../assets/hilx.jpg";
import P3 from "../assets/ggta.png";
import P4 from "../assets/amen.jpg";
import P5 from "../assets/bcbody.jpg";
import P6 from "../assets/spider.jpg";
import P7 from "../assets/aerl.jpg";
import P8 from "../assets/ndrl.jpg";
import P9 from "../assets/khl.jpg";
import P10 from "../assets/rdrp.jpg";
import P11 from "../assets/tlu.jpg";
import P12 from "../assets/redx.jpg";
import P13 from "../assets/6gta.jpg";
import P14 from "../assets/indx.jpg";

function MasonryGallery() {
  return (
    <div style={{ background: "#fff4f0" }} className="container mt-4">
      <div className="row g-3">

        {/* COLUMN 1 */}
        <div className="col-6 col-md-3 d-flex flex-column gap-3">
          <img className="img-fluid rounded" src={P7} alt="" />
          <img className="img-fluid rounded" src={P3} alt="" />
          <img className="img-fluid rounded" src={P6} alt="" />
          <img className="img-fluid rounded" src={P12} alt="" />
        </div>

        {/* COLUMN 2 */}
        <div className="col-6 col-md-3 d-flex flex-column gap-3">
          <img className="img-fluid rounded" src={P5} alt="" />
          <img className="img-fluid rounded" src={P4} alt="" />
          <img className="img-fluid rounded" src={P8} alt="" />
          <img className="img-fluid rounded" src={P13} alt="" />
        </div>

        {/* COLUMN 3 */}
        <div className="col-6 col-md-3 d-flex flex-column gap-3">
          <img className="img-fluid rounded" src={P9} alt="" />
          <img className="img-fluid rounded" src={P2} alt="" />
          <img className="img-fluid rounded" src={P1} alt="" />
          <img className="img-fluid rounded" src={P14} alt="" />
        </div>

        {/* COLUMN 4 */}
        <div className="col-6 col-md-3 d-flex flex-column gap-3">
          <img className="img-fluid rounded" src={P1} alt="" />
          <img className="img-fluid rounded" src={P10} alt="" />
          <img className="img-fluid rounded" src={P11} alt="" />
        </div>

      </div>
    </div>
  );
}

export default MasonryGallery;
