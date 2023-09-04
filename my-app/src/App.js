import Home from './components/Home.js';
import Upgrade from './components/Upgrade.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upgrades from './components/Upgrades.js';
import NavigationBar from './components/NavigationBar.js';
import Nodes from './components/Nodes.js';
import EditNodePage from './components/EditNodePage.js';
import Weapons from './components/Weapons.js';
import Weapon from './components/Weapon.js';
import Roles from './components/Roles.js';
import Role from './components/Role.js';
import Abilities from './components/Abilities.js';
import Ability from './components/Ability.js';

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
          <Route path="/node/:id" element={<EditNodePage/>}/>
          <Route path="/node" element={<Nodes/>} />
          <Route path="/weapon/:id" element={<Weapon/>}/>
          <Route path="/weapon" element={<Weapons />} />
          <Route path="/role/:id" element={<Role/>}/>
          <Route path="/role" element={<Roles />} />
          <Route path="/abilities/:id" element={<Ability/>}/>
          <Route path="/abilities" element={<Abilities />} />
          <Route path="*" element={<div>404 NOT FOUND</div>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
