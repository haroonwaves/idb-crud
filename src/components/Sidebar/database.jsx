import { useEffect, useState } from "preact/hooks";

import DroprightIcon from "../../icons/arrow-dropright.svg?component";
import DropdownIcon from "../../icons/arrow-dropdown.svg?component";
import dexieDatabase from "../../dexie/dexie";

import databaseStyles from "./Styles/database.scss?inline";

const Database = ({
  dbName,
  selectedDatabase,
  setSelectedDatabase,
  selectedTable,
  setSelectedTable,
}) => {
  const [openDb, setOpenDb] = useState(false);

  useEffect(() => {
    const db = dexieDatabase.select(dbName);
    if (!db.isOpen()) {
      db.open();
    }
  }, [dbName]);

  useEffect(() => {
    if (selectedDatabase === dbName) {
      setOpenDb(true);
    }
  }, []);

  const tables = dexieDatabase
    .select(dbName)
    .allTables()
    .map((table) => table.name);

  return (
    <>
      <style>{databaseStyles}</style>

      <div className="idb-crud-database">
        <div
          className="idb-crud-db-name"
          style={{ display: "flex", alignItems: "center" }}
        >
          <span>
            {openDb ? (
              <DropdownIcon onClick={() => setOpenDb(false)} />
            ) : (
              <DroprightIcon onClick={() => setOpenDb(true)} />
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
    </>
  );
};

export default Database;
