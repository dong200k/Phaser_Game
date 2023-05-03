import Home from './components/Home.js';
import Upgrade from './components/Upgrade.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upgrades from './components/Upgrades.js';
import NavigationBar from './components/NavigationBar.js';

function App() {
  return (
      <BrowserRouter>
        <NavigationBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/upgrade/:id" element={<Upgrade type="upgrade"/>}/>
          <Route path="/upgrade" element={<Upgrades type="upgrade"/>} />
          <Route path="/skill/:id" element={<Upgrade type="skill"/>}/>
          <Route path="/skill" element={<Upgrades type="skill"/>} />
          <Route path="*" element={<div>404 NOT FOUND</div>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
