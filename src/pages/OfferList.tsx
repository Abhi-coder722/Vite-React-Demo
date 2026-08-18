import { Alert, Grid } from "@mui/material";
import type { Offer } from "../api/types/offers";
import OfferCard from "../components/OfferCard";

interface OfferListProps {
  properties: Offer[];
  onToggleFeatured: (offer: Offer) => void;
}

function OfferList({ properties, onToggleFeatured }: OfferListProps) {
  if (properties.length === 0) {
    return (
      <Alert severity="info">No properties match the current filters.</Alert>
    );
  }

  return (
    <Grid container spacing={2.5} component="section">
      {properties.map((offer) => (
        <Grid key={offer.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <OfferCard offer={offer} onToggleFeatured={onToggleFeatured} />
        </Grid>
      ))}
    </Grid>
  );
}

export default OfferList;
