import { useCallback, useEffect, useState } from "preact/hooks";
import dexieDatabase from "./dexie/dexie";
import Drawer from "./components/drawer";

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

  return (
    <>
      <div id="idb-crud-app">
        <button
          className="idb-crud-drawer-toggler"
          type="button"
          onClick={toggleDrawer}
        >
          &lt;
        </button>
        <Drawer
          connected={connected}
          open={openDrawer}
          setOpen={setOpenDrawer}
          connectToDatabase={connectToDatabase}
        />
      </div>
    </>
  );
};
