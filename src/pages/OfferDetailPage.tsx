import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export type OfferStatus = "available" | "over" | "removed";

export interface Offer {
  id: string;
  provider: string;
  product: string;
  category: string;
  monthlyPrice: number;
  setupFee: number;
  speedMbps: number;
  rating: number;
  contractMonths: number;
  status: OfferStatus;
  featured: boolean;
}

interface LocationState {
  offer: Offer;
}

export default function OfferDetails() {
  const statusLabel: Record<OfferStatus, string> = {
    available: "Available",
    over: "Expired",
    removed: "Removed",
  };
  const location = useLocation();
  const navigate = useNavigate();

  const offer = (location.state as LocationState | null)?.offer;

  if (!offer) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Offer not found.</Typography>

        <Button onClick={() => navigate("/")}>Back to offers</Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 8 },
      }}
    >
      <Button onClick={() => navigate("/")}>back</Button>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            mb: 2,
          }}
        >
          <Chip
            label={statusLabel[offer.status]}
            size="small"
            variant="outlined"
          />

          {offer.featured && (
            <Chip label="Featured" size="small" color="primary" />
          )}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {offer.provider}
        </Typography>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {offer.product}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {offer.category}
        </Typography>
      </Box>

      <Divider />

      {/* Price */}
      <Box sx={{ py: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Monthly price
        </Typography>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            alignItems: "baseline",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            ${offer.monthlyPrice.toFixed(2)}
          </Typography>

          <Typography color="text.secondary">/ month</Typography>
        </Stack>
      </Box>

      <Divider />

      {/* Details */}
      <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ py: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Detail label="Speed" value={`${offer.speedMbps} Mbps`} />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Detail label="Contract" value={`${offer.contractMonths} months`} />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Detail
            label="Setup fee"
            value={
              offer.setupFee === 0 ? "Free" : `$${offer.setupFee.toFixed(2)}`
            }
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Detail label="Rating" value={`${offer.rating.toFixed(1)} / 5`} />
        </Grid>
      </Grid>

      <Divider />

      {/* Reference */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          py: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Offer ID
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
          }}
        >
          {offer.id}
        </Typography>
      </Stack>

      {/* Action */}
      {offer.status === "available" && (
        <Button
          variant="contained"
          fullWidth
          disableElevation
          sx={{
            mt: 2,
            py: 1.25,
            textTransform: "none",
          }}
        >
          Continue
        </Button>
      )}
    </Container>
  );
}

interface DetailProps {
  label: string;
  value: string;
}

function Detail({ label, value }: DetailProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
