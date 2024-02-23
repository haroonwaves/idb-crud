import { useState } from "preact/hooks";

import dexieDatabase from "../../dexie/dexie";
import Database from "./database";
import DroprightIcon from "../../icons/arrow-dropright.svg?component";
import DropdownIcon from "../../icons/arrow-dropdown.svg?component";
import RefreshIcon from "../../icons/refresh.svg?component";

const Sidebar = ({
  selectedDatabase,
  setSelectedDatabase,
  selectedTable,
  setSelectedTable,
  connectToDatabase,
}) => {
  const [openDbs, setOpenDbs] = useState(false);

  const dbNames = dexieDatabase.dbNames();

  return (
    <>
      <div className="flex justify-between items-center px-1 pt-1">
        <div className="flex items-center">
          <span>
            {openDbs ? (
              <DropdownIcon onClick={() => setOpenDbs(false)} />
            ) : (
              <DroprightIcon onClick={() => setOpenDbs(true)} />
            )}
          </span>
          <span>IndexedDB</span>
        </div>
        <span onClick={connectToDatabase}>
          <RefreshIcon />
        </span>
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
