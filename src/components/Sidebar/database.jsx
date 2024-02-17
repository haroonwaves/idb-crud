import { useEffect, useState } from "preact/hooks";

import RightArrow from "../../icons/arrow_right.svg?component";
import DownArrow from "../../icons/arrow_down.svg?component";

import "./styles/database.scss";
import dexieDatabase from "../../dexie/dexie";

const Database = ({
  dbName,
  setSelectedDatabase,
  selectedTable,
  setSelectedTable,
}) => {
  const [openDb, setOpenDb] = useState(false);

  useEffect(() => {
    const db = dexieDatabase[dbName];
    if (!db.isOpen()) {
      db.open();
    }
  }, [dbName]);

  const tables = dexieDatabase[dbName].allTables().map((table) => table.name);

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
        <span>{dbName}</span>
      </div>
      {openDb &&
        tables.map((table) => (
          <div
            className={`idb-crud-db-table ${
              selectedTable === table ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedDatabase(dbName);
              setSelectedTable(table);
            }}
          >
            {table}
          </div>
        ))}
    </div>
  );
};

export default Database;
