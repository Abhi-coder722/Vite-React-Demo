import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { Offer } from "../api/types/offers";
import { Grade, Speed } from "@mui/icons-material";

interface OfferCardProps {
  offer: Offer;
  onToggleFeatured: (offer: Offer) => void;
}

function PropertyCard({ offer, onToggleFeatured }: OfferCardProps) {
  const statusColor = {
    available: "success",
    over: "warning",
    removed: "default",
  } as const;
  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Chip
          label={status}
          color={statusColor[offer.status]}
          size="small"
          sx={{
            position: "absolute",
            left: 12,
            top: 12,
            textTransform: "capitalize",
            fontWeight: 700,
          }}
        />
        <Tooltip title={offer.featured ? "Remove Featured" : "Add Featured"}>
          <IconButton
            aria-label={offer.featured ? "Remove favorite" : "Add favorite"}
            onClick={() => onToggleFeatured(offer)}
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            {offer.featured ? (
              <FavoriteIcon color="secondary" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h2" sx={{ fontSize: 22, mb: 0.5 }}>
          {offer.id}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {offer.provider}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
          {offer.product}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Chip icon={<Speed />} label={offer.speedMbps} variant="outlined" />
          <Chip icon={<Grade />} label={offer.rating} variant="outlined" />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          component={Link}
          to={`/offer/${offer.id}`}
          variant="contained"
          endIcon={<OpenInNewIcon />}
        >
          View details
        </Button>
      </CardActions>
    </Card>
  );
}

export default PropertyCard;
