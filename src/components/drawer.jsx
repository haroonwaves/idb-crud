import { useContext, useState } from "preact/hooks";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AppStore } from "../app";
import Database from "./database";

import RightArrow from "../icons/arrow_right.svg?component";
import DownArrow from "../icons/arrow_down.svg?component";

import "./styles/drawer.scss";

const Drawer = ({ open }) => {
  const [openDbs, setOpenDbs] = useState(false);
  const { idb } = useContext(AppStore);
  const databases = Object.keys(idb);

  return (
    <div className={`idb-crud-drawer ${open ? "open" : ""}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>
          {openDbs ? (
            <DownArrow onClick={() => setOpenDbs(false)} />
          ) : (
            <RightArrow onClick={() => setOpenDbs(true)} />
          )}
        </span>
        <span>IndexedDB</span>
      </div>
      {openDbs &&
        (databases.length > 0 ? (
          databases.map((name) => <Database name={name} db={idb[name]} />)
        ) : (
          <div style={{ padding: "4px 17px" }}>No databases found...</div>
        ))}
    </div>
  );
};

export default Drawer;
