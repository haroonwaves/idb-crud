import { useEffect } from "preact/hooks";

import "./styles/database.scss";

const Database = ({ name, db }) => {
  useEffect(() => {
    if (!db.isOpen()) {
      db.open();
    }
  }, [name, db]);

  const tables = db.tables.map((table) => table.name);

  return (
    <details className="idb-crud-database">
      <summary className="idb-crud-db-name">{name}</summary>
      {tables.map((table) => (
        <div className="idb-crud-db-table">{table}</div>
      ))}
    </details>
  );
};

export default Database;
