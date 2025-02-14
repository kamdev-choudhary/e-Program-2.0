import React from "react";
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
  UploadRounded,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

interface CustomToolbarProps {
  onAdd?: () => void;
  onDownload?: () => void;
  onRefresh?: () => void;
  onUpload?: () => void;
  disableDownload?: boolean;
  disableRefresh?: boolean;
  searchPlaceholder?: string;
  showExport?: boolean;
  showColumns?: boolean;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({
  onAdd,
  onDownload,
  onRefresh,
  onUpload,
  disableDownload = false,
  disableRefresh = false,
  searchPlaceholder = "Search...",
  showExport = false,
  showColumns = true,
}) => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        p: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction="row" gap={1} alignItems="center">
        {showColumns && <GridToolbarColumnsButton />}
        {showExport && <GridToolbarExport />}
        <GridToolbarFilterButton />
        {onAdd && (
          <Button onClick={onAdd} startIcon={<AddRounded />}>
            Add
          </Button>
        )}
        {onUpload && (
          <Button
            onClick={onUpload}
            startIcon={<UploadRounded />}
            disabled={disableDownload}
          >
            Upload
          </Button>
        )}
        {onDownload && (
          <Button
            onClick={onDownload}
            startIcon={<DownloadRounded />}
            disabled={disableDownload}
          >
            Download
          </Button>
        )}
        {onRefresh && (
          <Button
            onClick={onRefresh}
            startIcon={<RefreshRounded />}
            disabled={disableRefresh}
          >
            Refresh
          </Button>
        )}
      </Stack>

      <GridToolbarQuickFilter placeholder={searchPlaceholder} />
    </GridToolbarContainer>
  );
};
