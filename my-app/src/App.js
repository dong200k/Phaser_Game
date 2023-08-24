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
import DataContextProvider from './contexts/DataContextProvider.js';
import Authorized from './components/Authorized.js';
import Dungeon from './components/dungeon/Dungeon.js';
import CreateOrEditDungeon from './components/dungeon/CreateOrEditDungeon.js';
import Admin from './components/admin/Admin.js';
import NotificationContextProvider from './contexts/NotificationContextProvider.js';
import Asset from './components/asset/Asset.js';
import CreateAsset from './components/asset/CreateAsset.js';
import CreateOrEditMonster from './components/monster/CreateOrEditMonster.js';

function App() {
  return (
    <NotificationContextProvider> {/* Provides notification callbacks */}
      <UserContextProvider> {/* Provides user authentication data */}
        <DataContextProvider> {/* Provides monster/dungeon data */}
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
                <Route path="/admin" element={<Authorized roles={["admin"]}><Admin /></Authorized>} />
                <Route path="/monster/create" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditMonster isEdit={false}/> </Authorized>} />
                <Route path="/monster/edit/:id" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditMonster isEdit={true}/></Authorized>} />
                <Route path="/monster" element={<Authorized roles={["admin", "gamemaster"]}><Monster /></Authorized>} />
                <Route path="/dungeon" element={<Authorized roles={["admin", "gamemaster"]}><Dungeon /></Authorized>} />
                <Route path="/dungeon/create" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditDungeon isEdit={false}/></Authorized>} />
                <Route path="/dungeon/edit/:id" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditDungeon isEdit={true}/></Authorized>} />
                <Route path="/asset" element={<Authorized roles={["admin", "gamemaster"]}><Asset /></Authorized>} />
                <Route path="/asset/create" element={<Authorized roles={["admin", "gamemaster"]}><CreateAsset /></Authorized>} />
                <Route path="*" element={<div>404 NOT FOUND</div>} />
              </Routes>
          </BrowserRouter>
        </DataContextProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  );
}

export default App;
