import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Offer, OfferStatus } from "../api/types/offers";

type AddOfferModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (offer: Offer) => void;
  offer: Offer;
};

export function EditOfferModal({
  open,
  onClose,
  onSubmit,
  offer,
}: AddOfferModalProps) {
  const [id, setId] = useState(offer.id);
  const [provider, setProvider] = useState(offer.provider);
  const [product, setProduct] = useState(offer.product);
  const [category, setCategory] = useState(offer.category);
  const [monthlyPrice, setMonthlyPrice] = useState(offer.monthlyPrice);
  const [setupFee, setSetupFee] = useState(offer.setupFee);
  const [speedMbps, setSpeedMbps] = useState(offer.speedMbps);
  const [rating, setRating] = useState(offer.rating);
  const [contractMonths, setContractMonths] = useState(offer.contractMonths);
  const [status, setStatus] = useState<OfferStatus>("available");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOffer = {
      id,
      provider,
      product,
      category,
      monthlyPrice: Number(monthlyPrice),
      setupFee: Number(setupFee),
      speedMbps: Number(speedMbps),
      rating: Number(rating),
      contractMonths: Number(contractMonths),
      status,
      featured: false,
    };

    onSubmit(newOffer);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add new offer
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            required
          />

          <TextField
            label="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />

          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <TextField
            label="Monthly price"
            type="number"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(Number(e.target.value))}
          />

          <TextField
            label="Setup fee"
            type="number"
            value={setupFee}
            onChange={(e) => setSetupFee(Number(e.target.value))}
          />

          <TextField
            label="Speed (Mbps)"
            type="number"
            value={speedMbps}
            onChange={(e) => setSpeedMbps(Number(e.target.value))}
          />

          <TextField
            label="Rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />

          <TextField
            label="Contract months"
            type="number"
            value={contractMonths}
            onChange={(e) => setContractMonths(Number(e.target.value))}
          />

          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
              <MenuItem value="removed">Removed</MenuItem>
            </Select>
          </FormControl>

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button onClick={onClose}>Cancel</Button>

            <Button type="submit" variant="contained">
              Save offer
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
