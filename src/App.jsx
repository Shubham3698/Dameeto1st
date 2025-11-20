import MasonryGallery from "./components/MasonryGallery";
import Hh from'./components/header'
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './components/NavbarMain'
import Tp from './components/tpmenu'
function App() {
  return (
    <div className="p-4">
      <Tp/>
      {/* <Nav/> */}


      {/* <Hh/> */}
      <MasonryGallery />
    </div>
  );
}

export default App;
