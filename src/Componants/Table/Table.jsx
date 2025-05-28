import React from "react";
import DataTable, { createTheme } from "react-data-table-component";

function Table({ data,columns }) {
  createTheme(
    "solarized",
    {
      text: {
        primary: "#fff",
        secondary: "#2aa198",
      },
      background: {
        default: "#2b2d3a",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#fff",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );
  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: 'All',
  };
  return (
    <div
      style={{
        padding: "8px 0px",
        borderRadius: "8px",
        margin: "8px 0",
        // backgroundColor: "#2b2d3a",
      }}
    >
      <DataTable
        data={data}
        columns={columns}
        // data={columns}
        // theme="solarized"
        pagination
        paginationPerPage={10} // Limiting rows per page to 10
        paginationRowsPerPageOptions={[10]} // Only show option for 10 rows per page
        paginationComponentOptions={paginationOptions}
        // {...rest}
      />
    </div>
  );
}

export default Table;
