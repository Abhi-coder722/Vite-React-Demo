import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateOffer,
  useServerOffers,
  useUpdateFeatured,
} from "../api/rest/useOffers";
import { useState } from "react";
import { MoreVert, Search } from "@mui/icons-material";
import { AddOfferModal } from "../components/ModalForm";
import type { Offer } from "../api/types/offers";

type Sort = "price-asc" | "price-desc";

export function AllOffers() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>();
  const updateFeatured = useUpdateFeatured();
  const [open, setOpen] = useState(false);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [isSuccessSnackBarOpen, setIsSuccessSnackBarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const createOffer = useCreateOffer();
  const { data: offersResponse } = useServerOffers({
    search,
    sort,
    page,
    rowsPerPage,
  });
  const offers = offersResponse?.data ?? [];
  const offerCount = offersResponse?.items ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleSortChange = (value: Sort) => {
    setSort(value);
    setPage(0);
  };

  const handleSubmit = (data: Offer) => {
    createOffer.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        setIsSuccessSnackBarOpen(true);
      },
      onError: () => {
        setIsSnackBarOpen(true);
      },
    });
  };

  const handleClose = () => {
    setIsSnackBarOpen(false);
    setIsSuccessSnackBarOpen(false);
  };

  return (
    <>
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Error on creating offer"
        color="red"
      />
      <Snackbar
        open={isSuccessSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully created an offer"
        color="green"
      />
      <Button onClick={() => setOpen(true)}>Add a new offer :</Button>
      <Paper sx={{ p: 2, mb: 2, mt: 10 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ alignItems: { md: "center" } }}
        >
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search provider or product..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              label="Sort by"
              onChange={(e) => {
                handleSortChange(e.target.value as Sort);
              }}
            >
              <MenuItem value="price-asc">Lowest price</MenuItem>
              <MenuItem value="price-desc">Highest price</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Speed</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {offers.map((offer) => (
                <TableRow hover key={offer.id} onClick={() => {}}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {offer.provider}
                    </Typography>
                  </TableCell>

                  <TableCell>{offer.product}</TableCell>

                  <TableCell>
                    <Chip
                      label={offer.category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    {offer.monthlyPrice != null
                      ? `€${offer.monthlyPrice.toFixed(2)}`
                      : "—"}
                  </TableCell>

                  <TableCell align="right">{offer.speedMbps} Mbps</TableCell>

                  <TableCell align="right">{offer.rating ?? "—"}</TableCell>

                  <TableCell>
                    <Chip
                      label={offer.status}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Switch
                      size="small"
                      checked={offer.featured}
                      onChange={() => updateFeatured.mutate(offer)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          component="div"
          count={offerCount}
          page={page}
          onPageChange={(_, newPage) => {
            setPage(newPage);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
      <AddOfferModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
