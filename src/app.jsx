import { useEffect, useState } from "preact/hooks";
import dexieDatabase from "./dexie/dexie";
import Drawer from "./components/drawer";

import "./styles/app.scss";

export const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    dexieDatabase.connect().then(() => {
      setConnected(true);
    });
  }, []);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  if (!connected) {
    return <>Waiting for connection...</>;
  }

  return (
    <div className="idb-crud-main">
      <button
        className="idb-crud-drawer-toggler"
        type="button"
        onClick={toggleDrawer}
      >
        &lt;
      </button>
      <Drawer open={openDrawer} setOpen={setOpenDrawer} />
    </div>
  );
};
