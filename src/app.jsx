import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import dexieDatabase from "./dexie/dexie";
import Drawer from "./components/drawer";
import ToastContainer from "./components/Common/toast-container";
import chromeStorage from "./PersistentStorage/ChromeStorage/store.js";

export const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [connected, setConnected] = useState(false);

  const closeDrawerRef = useRef(null);

  const connectToDatabase = useCallback(async () => {
    setConnected(false);
    await dexieDatabase.connect();
    setConnected(true);
  }, []);

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "icon_clicked") {
      if (openDrawer) {
        closeDrawerRef.current && closeDrawerRef.current();
      } else {
        setOpenDrawer(true);
      }
    }
  });

  useEffect(() => {
    chromeStorage.registerUser();
    connectToDatabase();
  }, [connectToDatabase]);

  return (
    <>
      <div id="idb-crud-app">
        <ToastContainer />
        <Drawer
          connected={connected}
          open={openDrawer}
          setOpen={setOpenDrawer}
          closeDrawerRef={closeDrawerRef}
          connectToDatabase={connectToDatabase}
        />
      </div>
    </>
  );
};
