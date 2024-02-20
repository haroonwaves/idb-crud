import { useState } from "preact/hooks";

import Database from "./database";
import DroprightIcon from "../../icons/arrow-dropright.svg?component";
import DropdownIcon from "../../icons/arrow-dropdown.svg?component";
import dexieDatabase from "../../dexie/dexie";

const Sidebar = ({
  selectedDatabase,
  setSelectedDatabase,
  selectedTable,
  setSelectedTable,
}) => {
  const [openDbs, setOpenDbs] = useState(false);

  const dbNames = dexieDatabase.dbNames();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>
          {openDbs ? (
            <DropdownIcon onClick={() => setOpenDbs(false)} />
          ) : (
            <DroprightIcon onClick={() => setOpenDbs(true)} />
          )}
        </span>
        <span>IndexedDB</span>
      </div>
      {openDbs &&
        (dbNames.length > 0 ? (
          dbNames.map((name) => (
            <Database
              dbName={name}
              setSelectedDatabase={setSelectedDatabase}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
            />
          ))
        ) : (
          <div style={{ padding: "4px 17px" }}>No databases found...</div>
        ))}
    </>
  );
};

export default Sidebar;
