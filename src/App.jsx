import React from "react";
import MasonryGallery from "./components/MasonryGallery";
import data from "./data/Data";
import Header from './components/header'

function App() {
  return(
  <>
 <Header/>
  <MasonryGallery items={data} />;
  </> )
}

export default App;
