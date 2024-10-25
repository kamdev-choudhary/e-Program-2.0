import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  AddRounded,
  DownloadRounded,
  RefreshRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useGlobalProvider } from "../GlobalProvider";

const CustomToolbar = ({
  showAddButton = true,
  onAddButtonClick,
  showDownloadButton = false,
  onDowloadButtonClick,
  showRefreshButton = false,
  onRefreshButtonClick,
  disabledDownloadButton = false,
  disabledRefreshButton = false,
  showExportButton = false,
  showGridToolbarColumnButton = true,
}) => {
  const { deviceTheme } = useGlobalProvider();
  return (
    <GridToolbarContainer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "background.paper",
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 8,
      }}
    >
      <div>
        {showGridToolbarColumnButton && <GridToolbarColumnsButton />}
        {showExportButton && <GridToolbarExport />}
        <GridToolbarFilterButton />
        {showAddButton && (
          <Button onClick={onAddButtonClick} startIcon={<AddRounded />}>
            Add
          </Button>
        )}
        {showDownloadButton && (
          <Button
            onClick={onDowloadButtonClick}
            startIcon={<DownloadRounded />}
            disabled={disabledDownloadButton}
          >
            Download
          </Button>
        )}
        {showRefreshButton && (
          <Button
            disabled={disabledRefreshButton}
            onClick={onRefreshButtonClick}
            startIcon={<RefreshRounded />}
          >
            Refresh
          </Button>
        )}
      </div>
      <GridToolbarQuickFilter
        style={{
          borderRadius: 6,
          padding: 8,
          minWidth: 350,
          backgroundColor: deviceTheme === "light" ? "rgba(244,244,244,1)" : "",
        }}
      />
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
