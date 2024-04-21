import * as React from "react";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function HitAndTy() {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Typography>Page: {page}</Typography>
      <Pagination count={200} page={page} onChange={handleChange} />
      <Pagination count={200} page={page} onChange={handleChange} />
    </Stack>
  );
}
