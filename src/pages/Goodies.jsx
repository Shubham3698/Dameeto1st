import React from "react";
import Nwmasonry from "../components/Nwmasonry";
import { goodiesData } from "../contexAndhooks/Ddata";

export default function Goodies() {
  return <Nwmasonry images={goodiesData} categoryName="Goodies" />;
}
