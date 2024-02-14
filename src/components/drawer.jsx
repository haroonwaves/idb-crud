import { useContext, useState } from "preact/hooks";
import { AppStore } from "../app";
import Database from "./database";

import "./styles/drawer.scss";

const Drawer = ({ open }) => {
  const { idb } = useContext(AppStore);
  const databases = Object.keys(idb);

  return (
    <div className={`idb-crud-drawer ${open ? "open" : ""}`}>
      <details>
        <summary>IndexedDb</summary>
        {databases.length > 0 ? (
          databases.map((name) => <Database name={name} db={idb[name]} />)
        ) : (
          <div style={{ padding: "3px 15px" }}>No databases found...</div>
        )}
      </details>
    </div>
  );
};

export default Drawer;
