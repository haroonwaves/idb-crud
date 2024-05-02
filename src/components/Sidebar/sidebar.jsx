import { useState } from "preact/hooks";

import dexieDatabase from "../../dexie/dexie";
import Database from "./database";
import DroprightIcon from "../../icons/arrow-dropright.svg?component";
import DropdownIcon from "../../icons/arrow-dropdown.svg?component";
import RefreshIcon from "../../icons/refresh.svg?component";
import Tooltip from "../Common/Tooltip";

const Sidebar = ({ connected, refreshDatabase }) => {
  const [openDbs, setOpenDbs] = useState(true);

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
        <Tooltip text="Refresh database" position="left">
          <RefreshIcon onClick={refreshDatabase} />
        </Tooltip>
      </div>
      {!connected ? (
        <div style={{ padding: "4px 17px" }}>Connecting...</div>
      ) : (
        openDbs &&
        (dbNames.length > 0 ? (
          dbNames.map((name) => <Database dbName={name} />)
        ) : (
          <div style={{ padding: "4px 17px" }}>No databases found...</div>
        ))
      )}
    </>
  );
};

export default Sidebar;
