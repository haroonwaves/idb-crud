import { useState } from "preact/hooks";

import Drawer from "./components/drawer";

import "./styles/app.scss";

export const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <div className="idb-crud-main">
      <button type="button" onClick={toggleDrawer}>
        &lt;
      </button>
      <Drawer open={openDrawer} />
    </div>
  );
};
