import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
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
  useEditOffer,
  useOffers,
  useUpdateFeatured,
} from "../api/rest/useOffers";
import { useMemo, useState } from "react";
import { Edit, Search } from "@mui/icons-material";
import { AddOfferModal } from "../components/ModalForm";
import type { Offer } from "../api/types/offers";
import { EditOfferModal } from "../components/EditModalForm";
import OfferDetails from "./OfferDetailPage";
import { useNavigate } from "react-router-dom";

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
  const editOffer = useEditOffer();
  const [isEditModalOpen, setEditModalOpen] = useState<Offer>();
  const { data: offers = [] } = useOffers();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleSortChange = (value: Sort) => {
    setSort(value);
    setPage(0);
  };

  const filteredOffers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return offers;
    }

    return offers.filter(
      (offer) =>
        offer.provider.toLowerCase().includes(query) ||
        offer.product.toLowerCase().includes(query),
    );
  }, [offers, search]);

  const sortedOffers = useMemo(() => {
    if (!sort) {
      return filteredOffers;
    }

    const offersToSort = [...filteredOffers];

    if (sort === "price-asc") {
      return offersToSort.sort(
        (a, b) => (a.monthlyPrice ?? 0) - (b.monthlyPrice ?? 0),
      );
    }

    return offersToSort.sort(
      (a, b) => (b.monthlyPrice ?? 0) - (a.monthlyPrice ?? 0),
    );
  }, [filteredOffers, sort]);

  const paginatedOffers = useMemo(() => {
    const start = page * rowsPerPage;

    return sortedOffers.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, sortedOffers]);

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
  const handleEditSubmit = (data: Offer) => {
    editOffer.mutate(data, {
      onSuccess: () => {
        setEditModalOpen(undefined);
        setIsSuccessSnackBarOpen(true);
      },
      onError: () => {
        setIsSnackBarOpen(true);
      },
    });
  };
  const navigate = useNavigate();
  const handleDetails = (offer: Offer) => {
    navigate(`/details/${offer.id}`, {
      state: { offer },
    });
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
              {paginatedOffers.map((offer) => (
                <TableRow
                  hover
                  key={offer.id}
                  onClick={() => handleDetails(offer)}
                >
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
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => updateFeatured.mutate(offer)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => setEditModalOpen(offer)}>
                      <Edit />
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
          count={sortedOffers.length}
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
      {!!isEditModalOpen && (
        <EditOfferModal
          offer={isEditModalOpen!}
          open={!!isEditModalOpen}
          onClose={() => setEditModalOpen(undefined)}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
}
