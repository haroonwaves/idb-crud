import { useCallback } from "preact/hooks";
import JsonViewer from "react-json-view";

import { replace } from "../../../dexie/dexie";

import editorStyles from "./Styles/editor.scss?inline";

const Editor = ({
  selectedRows,
  selectedDatabase,
  selectedTable,
  onAfterEdit,
}) => {
  const onEdit = useCallback(
    ({ existing_src, updated_src, namespace }) => {
      const existingRows = [];
      const updatedRows = [];
      for (const index in namespace) {
        const existingRow = existing_src[index];
        const updatedRow = updated_src[index];
        if (existingRow) existingRows.push(existingRow);
        if (updatedRow) updatedRows.push(updatedRow);
      }

      replace(existingRows, updatedRows, selectedDatabase, selectedTable).then(
        () => {
          onAfterEdit();
        }
      );
    },
    [selectedDatabase, selectedTable]
  );

  return (
    <>
      <style>{editorStyles}</style>
      <div className="idb-crud-editor">
        {selectedRows ? (
          <JsonViewer
            theme="rjv-default"
            name="array"
            onAdd={(data) => !!data.name}
            onEdit={onEdit}
            displayObjectSize
            collapsed={1}
            quotesOnKeys={false}
            enableClipboard={false}
            displayDataTypes={false}
            collapseStringsAfterLength={100}
            groupArraysAfterLength={50}
            src={selectedRows}
          />
        ) : (
          <div className="idb-crud-text-center">Select a row to view</div>
        )}
      </div>
    </>
  );
};

export default Editor;
