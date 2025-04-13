import { useEffect, useMemo, useState } from "preact/hooks";
import JsonViewer from "react-json-view";

import editorStyles from "./Styles/editor.scss?inline";
import createPlaceholderObject from "../Utils/create-placeholder-object";
import getSelectedValues from "../../../Utils/get-selected-values";
import appState from "../../../AppState/appSate";
import onEdit from "./QueryHelper/on-edit";

const Editor = () => {
  const selectedRows = appState.selectedRows.value;
  const selectedValues = useMemo(() => getSelectedValues(), [selectedRows]);

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (selectedValues.length) {
      setValue(selectedValues);
    } else {
      setValue(null);
    }
  }, [selectedValues]);

  return (
    <>
      <style>{editorStyles}</style>
      <div className="idb-crud-editor">
        {value ? (
          <JsonViewer
            theme="rjv-default"
            name={"selected_rows"}
            onAdd={(data) => {
              if (!data.name)
                setValue([...value, createPlaceholderObject(value[0])]);
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
