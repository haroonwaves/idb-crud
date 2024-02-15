import { useContext, useState } from "preact/hooks";

import { AppStore } from "../../../app";
import Database from "./database";
import RightArrow from "../../../icons/arrow_right.svg?component";
import DownArrow from "../../../icons/arrow_down.svg?component";

const Sidebar = () => {
  const [openDbs, setOpenDbs] = useState(false);
  const { idb } = useContext(AppStore);
  const databases = Object.keys(idb);

  return (
    <>
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
    </>
  );
};

export default Sidebar;
