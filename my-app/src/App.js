import Home from './components/Home.js';
import Upgrade from './components/Upgrade.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upgrades from './components/Upgrades.js';
import NavigationBar from './components/NavigationBar.js';
import Nodes from './components/Nodes.js';
import EditNodePage from './components/EditNodePage.js';
import Weapons from './components/Weapons.js';
import Weapon from './components/Weapon.js';
import UserContextProvider, { UserContext } from './contexts/UserContextProvider.js';
import Monster from './components/monster/Monster.js';
import CreateMonster from './components/monster/CreateMonster.js';
import EditMonster from './components/monster/EditMonster.js';

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <NavigationBar/>
          <UserContext.Consumer>
            {
              (userContext) => {
                return (<Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/upgrade/:id" element={<Upgrade type="upgrade"/>}/>
                  <Route path="/upgrade" element={<Upgrades type="upgrade"/>} />
                  <Route path="/skill/:id" element={<Upgrade type="skill"/>}/>
                  <Route path="/skill" element={<Upgrades type="skill"/>} />
                  <Route path="/node/:id" element={<EditNodePage/>}/>
                  <Route path="/node" element={<Nodes/>} />
                  <Route path="/weapon/:id" element={<Weapon/>}/>
                  <Route path="/weapon" element={<Weapons />} />
                  <Route path="/monster/create" element={<CreateMonster user={userContext.user}/>} />
                  <Route path="/monster/edit/:id" element={<EditMonster />} />
                  <Route path="/monster" element={<Monster />} />
                  <Route path="*" element={<div>404 NOT FOUND</div>} />
                </Routes>)
              }
            }
          </UserContext.Consumer>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
