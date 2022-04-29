import { useEffect } from "react";

import { Paper } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridSelector,
  GridToolbarContainer,
  useGridApiContext,
  GridToolbarExport,
} from "@mui/x-data-grid";
import "./Table.css";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";

function Table(props) {
  function CustomToolBar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{
            allColumns: true,
            fileName: props.filename,
            fields: props.fields,
          }}
          printOptions={{
            disableToolbarButton: true,
          }}
          className="exportButton"
        />
      </GridToolbarContainer>
    );
  }

  const PaginationRounded = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    useEffect(() => {
      // reset to 1st page when apply/filter is clicked
      if (props.resetPage) {
        apiRef.current.setPage(0);
      }
    }, [props.resetPage]);

    return (
      <Pagination
        variant="outlined"
        shape="rounded"
        color="standard"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        sx={{
          position: "absolute",
          left: "0px",
          paddingLeft: 2,
          paddingBottom: 1,
        }}
      />
    );
  };

  return (
    <Paper className="dataTable" elevation={3}>
      {props.isLoading ? (
        <LoadingAnimation />
      ) : (
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          pageSize={10}
          density="compact"
          pagination
          disableColumnFilter
          disableSelectionOnClick
          hideFooterSelectedRowCount
          components={{
            Pagination: PaginationRounded,
            Toolbar: CustomToolBar,
          }}
          sx={props.sx}
        />
      )}
    </Paper>
  );
}

export default Table;
