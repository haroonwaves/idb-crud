import { useCallback, useEffect, useState } from "preact/hooks";
import dexieDatabase from "./dexie/dexie";
import Drawer from "./components/drawer";

import appStyles from "./styles/app.scss?inline";

export const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectToDatabase = useCallback(async () => {
    setConnected(false);
    await dexieDatabase.connect();
    setConnected(true);
  }, []);

  useEffect(() => {
    connectToDatabase();
  }, [connectToDatabase]);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  if (!connected) {
    return <>Waiting for connection...</>;
  }

  return (
    <>
      <style>{appStyles}</style>
      <div id="idb-crud-app">
        <button
          className="idb-crud-drawer-toggler"
          type="button"
          onClick={toggleDrawer}
        >
          &lt;
        </button>
        <Drawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          connectToDatabase={connectToDatabase}
        />
      </div>
    </>
  );
};
