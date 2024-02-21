import { useState } from "react";
import { createRef } from "preact";
import ChevronDownIcon from "../../icons/chevron_down.svg?component";

import "./Style/multi-select.scss";
import { useEffect } from "preact/hooks";

const MultiSelect = ({
  options,
  onSelect,
  selectedColumns = [],
  placeHolder,
}) => {
  const [selected, setSelected] = useState(selectedColumns);
  const [open, setOpen] = useState(false);

  const multiSelectRef = createRef(null);

  useEffect(() => {
    setSelected(selectedColumns);
  }, [selectedColumns]);

  const handleSelect = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter((selectedId) => selectedId !== id)
      : [...selected, id];

    setSelected(newSelected);
  };

  const onToggle = () => {
    setOpen((prev) => !prev);
    if (open) {
      onClose();
    } else {
      multiSelectRef?.current?.focus(); // Not working
    }
  };

  const onClose = () => {
    onSelect(selected);
  };

  return (
    <div
      ref={multiSelectRef}
      className={`idb-crud-multi-select ${open ? "open" : ""}`}
    >
      <div
        className="idb-crud-multi-select-toggler"
        onClick={onToggle}
        onBlur={onToggle}
      >
        <div>
          {options.length === selected.length
            ? placeHolder
            : options.length - selected.length + ` Unselected`}{" "}
        </div>
        <span className="idb-crud-select-toggler-icon">
          <ChevronDownIcon />
        </span>
      </div>
      <ul className="idb-crud-multi-select-options">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <li
              className="idb-crud-multi-select-option"
              onClick={() => handleSelect(option.id)}
            >
              <input
                type="checkbox"
                checked={isSelected}
                className="idb-crud-multi-select-option-checkbox"
              ></input>
              <span>{option.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MultiSelect;
