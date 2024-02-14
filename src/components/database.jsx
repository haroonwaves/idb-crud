import { useEffect, useState } from "preact/hooks";

import RightArrow from "../icons/arrow_right.svg?component";
import DownArrow from "../icons/arrow_down.svg?component";

import "./styles/database.scss";

const Database = ({ name, db }) => {
  const [openDb, setOpenDb] = useState(false);

  useEffect(() => {
    if (!db.isOpen()) {
      db.open();
    }
  }, [name, db]);

  const tables = db.tables.map((table) => table.name);

  return (
    <div className="idb-crud-database">
      <div
        className="idb-crud-db-name"
        style={{ display: "flex", alignItems: "center" }}
      >
        <span>
          {openDb ? (
            <DownArrow onClick={() => setOpenDb(false)} />
          ) : (
            <RightArrow onClick={() => setOpenDb(true)} />
          )}
        </span>
        <span>{name}</span>
      </div>
      {openDb &&
        tables.map((table) => <div className="idb-crud-db-table">{table}</div>)}
    </div>
  );
};

export default Database;
