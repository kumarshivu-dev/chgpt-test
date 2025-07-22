import { useEffect, useRef } from "react";
import { Checkbox } from "@mui/material";

export default function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Checkbox
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
      style={{
        margin: "0px 10px",
        borderRadius: "15px",
        color: "#022149",
      }}
    />
  );
}
