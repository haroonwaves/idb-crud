import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import { connect } from "./dexie/dexie";
import Drawer from "./components/drawer";

import "./styles/app.scss";

const initialValue = {
  idb: null,
};

export const AppStore = createContext(initialValue);

export const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    connect().then((databases) => {
      initialValue.idb = databases;
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
    <AppStore.Provider value={initialValue}>
      <div className="idb-crud-main">
        <button type="button" onClick={toggleDrawer}>
          &lt;
        </button>
        <Drawer open={openDrawer} />
      </div>
    </AppStore.Provider>
  );
};
