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
import UserContextProvider from './contexts/UserContextProvider.js';
import Monster from './components/monster/Monster.js';
import DataContextProvider from './contexts/DataContextProvider.js';
import Authorized from './components/Authorized.js';
import Dungeon from './components/dungeon/Dungeon.js';
import CreateOrEditDungeon from './components/dungeon/CreateOrEditDungeon.js';
import Admin from './components/admin/Admin.js';
import NotificationContextProvider from './contexts/NotificationContextProvider.js';
import Asset from './components/asset/Asset.js';
import CreateOrEditAsset from './components/asset/CreateOrEditAsset.js';
import CreateOrEditMonster from './components/monster/CreateOrEditMonster.js';
import { JsonDB } from './components/JsonDB.js';
import BackupHome from './components/backup/BackupHome.js';
import BackupView from './components/backup/BackupView.js';
import RestoreView from './components/backup/RestoreView.js';

function App() {
  return (
    <NotificationContextProvider> {/* Provides notification callbacks */}
      <UserContextProvider> {/* Provides user authentication data */}
        <DataContextProvider> {/* Provides monster/dungeon data */}
          <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
            <NavigationBar/>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/json" element={<Authorized roles={["admin", "gamemaster"]}><JsonDB/></Authorized>}/>
                <Route path="/role/:id" element={<Authorized roles={["admin", "gamemaster"]}><Role/></Authorized>}/>
                <Route path="/role" element={<Authorized roles={["admin", "gamemaster"]}><Roles /></Authorized>} />
                <Route path="/abilities/:id" element={<Authorized roles={["admin", "gamemaster"]}><Ability/></Authorized>}/>
                <Route path="/abilities" element={<Authorized roles={["admin", "gamemaster"]}><Abilities /></Authorized>} />
                <Route path="/upgrade/:id" element={<Authorized roles={["admin", "gamemaster"]}><Upgrade type="upgrade"/></Authorized>}/>
                <Route path="/upgrade" element={<Authorized roles={["admin", "gamemaster"]}><Upgrades type="upgrade"/></Authorized>} />
                <Route path="/skill/:id" element={<Authorized roles={["admin", "gamemaster"]}><Upgrade type="skill"/></Authorized>}/>
                <Route path="/skill" element={<Authorized roles={["admin", "gamemaster"]}><Upgrades type="skill"/></Authorized>} />
                <Route path="/node/:id" element={<Authorized roles={["admin", "gamemaster"]}><EditNodePage/></Authorized>}/>
                <Route path="/node" element={<Authorized roles={["admin", "gamemaster"]}><Nodes/></Authorized>} />
                <Route path="/weapon/:id" element={<Authorized roles={["admin", "gamemaster"]}><Weapon/></Authorized>}/>
                <Route path="/weapon" element={<Authorized roles={["admin", "gamemaster"]}><Weapons /></Authorized>} />
                <Route path="/admin" element={<Authorized roles={["admin"]}><Admin /></Authorized>} />
                <Route path="/monster/create" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditMonster isEdit={false}/> </Authorized>} />
                <Route path="/monster/edit/:id" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditMonster isEdit={true}/></Authorized>} />
                <Route path="/monster" element={<Authorized roles={["admin", "gamemaster"]}><Monster /></Authorized>} />
                <Route path="/dungeon" element={<Authorized roles={["admin", "gamemaster"]}><Dungeon /></Authorized>} />
                <Route path="/dungeon/create" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditDungeon isEdit={false}/></Authorized>} />
                <Route path="/dungeon/edit/:id" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditDungeon isEdit={true}/></Authorized>} />
                <Route path="/asset" element={<Authorized roles={["admin", "gamemaster"]}><Asset /></Authorized>} />
                <Route path="/asset/create" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditAsset /></Authorized>} />
                <Route path="/asset/edit/:id" element={<Authorized roles={["admin", "gamemaster"]}><CreateOrEditAsset isEdit={true} /></Authorized>} />
                <Route path="/backup" element={<Authorized roles={["admin", "gamemaster"]}><BackupHome /></Authorized>} />
                <Route path="/backup/backup" element={<Authorized roles={["admin", "gamemaster"]}><BackupView /></Authorized>} />
                <Route path="/backup/restore" element={<Authorized roles={["admin", "gamemaster"]}><RestoreView /></Authorized>} />
                <Route path="*" element={<div>404 NOT FOUND</div>} />
              </Routes>
          </BrowserRouter>
        </DataContextProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  );
}

export default App;
