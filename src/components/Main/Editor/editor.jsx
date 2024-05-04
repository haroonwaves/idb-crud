import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import JsonViewer from "react-json-view";

import { replace } from "../../../dexie/dexie";

import editorStyles from "./Styles/editor.scss?inline";
import createPlaceholderObject from "./create-placeholder-object";
import { showToast } from "../../../Toast/toast-manager";
import getSelectedValues from "../../../Utils/get-selected-values";
import appState from "../../../AppState/appSate";

const Editor = ({ addedRow, onAfterEdit }) => {
  const selectedRows = appState.selectedRows.value;
  const selectedValues = useMemo(() => getSelectedValues(), [selectedRows]);

  const [value, setValue] = useState(null);
  const [mode, setMode] = useState("");

  useEffect(() => {
    if (addedRow) {
      setValue(addedRow);
      setMode("Create");
    } else if (selectedValues.length) {
      setValue(selectedValues);
      setMode("Edit");
    } else {
      setValue(null);
    }
  }, [addedRow, selectedValues]);

  const onEdit = useCallback(
    ({ existing_src, updated_src, namespace }) => {
      const existingRows = [];
      const updatedRows = [];

      if (mode === "Create") {
        updatedRows.push(updated_src);
      } else {
        for (const index of namespace) {
          const existingRow = existing_src[index];
          const updatedRow = updated_src[index];
          if (existingRow) existingRows.push(existingRow);
          if (updatedRow) updatedRows.push(updatedRow);
        }
      }

      replace(existingRows, updatedRows)
        .then(() => {
          showToast({
            message: mode === "Edit" ? "Update success" : "Create success",
            type: "success",
          });
          if (mode === "Create") {
            setMode("Edit");
            setValue([updated_src]);
          }

          return onAfterEdit();
        })
        .catch(() =>
          showToast({
            message: mode === "Edit" ? "Update failed" : "Create failed",
            type: "failure",
          })
        );
    },
    [mode, setMode]
  );

  return (
    <>
      <style>{editorStyles}</style>
      <div className="idb-crud-editor">
        {value ? (
          <JsonViewer
            theme="rjv-default"
            name={mode === "Edit" ? "selected_rows" : "new_record"}
            onAdd={(data) => {
              if (!data.name && mode === "Edit") {
                setValue([...value, createPlaceholderObject(value[0])]);
              }
            }}
            defaultValue={"placeholder"}
            onEdit={onEdit}
            displayObjectSize
            collapsed={1}
            quotesOnKeys={false}
            enableClipboard={false}
            displayDataTypes={false}
            collapseStringsAfterLength={100}
            groupArraysAfterLength={50}
            src={value}
          />
        ) : (
          <div className="idb-crud-text-center" style={{ color: "#94a3b8" }}>
            Select a row to view
          </div>
        )}
      </div>
    </>
  );
};

export default Editor;
