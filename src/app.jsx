import { useCallback, useEffect, useState } from "preact/hooks";
import dexieDatabase from "./dexie/dexie";
import Drawer from "./components/drawer";
import ToastContainer from "./components/Common/toast-container";

export const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectToDatabase = useCallback(async () => {
    setConnected(false);
    await dexieDatabase.connect();
    setConnected(true);
  }, []);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "icon_clicked") {
      if (openDrawer) {
        closeDrawer();
      } else {
        setOpenDrawer(true);
      }
    }
  });

  useEffect(() => {
    if (openDrawer) {
      connectToDatabase();
    }
  }, [connectToDatabase, openDrawer]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setConnected(false);
  };

  return (
    <>
      <div id="idb-crud-app">
        <ToastContainer />
        <Drawer
          connected={connected}
          open={openDrawer}
          closeDrawer={closeDrawer}
          connectToDatabase={connectToDatabase}
        />
      </div>
    </>
  );
};
