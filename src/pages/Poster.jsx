import React from "react";
import Nwmasonry from "../components/Nwmasonry";
import { posterData } from "../contexAndhooks/Ddata";

export default function Poster() {
  return <Nwmasonry images={posterData} categoryName="Poster" />;
}
