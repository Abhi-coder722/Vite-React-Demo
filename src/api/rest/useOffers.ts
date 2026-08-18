import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Offer } from "../types/offers";
import { fetchClient } from "../fetchClient";

type OffersResponse = Offer[];
type OfferResponse = Offer;
type UpdateFeaturedRequest = Pick<Offer, "featured">;

const offerKeys = {
  all: ["properties"] as const,

  detail: (id: string | undefined) => ["offer", id] as const,
};

export function useOffers() {
  const getOffers = () => fetchClient.GET<OffersResponse>("/offers", {});

  return useQuery({
    queryKey: offerKeys.all,
    queryFn: getOffers,
  });
}

export function useSingleOffer(id: string) {
  const getSpecificOffer = () =>
    fetchClient.GET<OfferResponse>(`/offers/${id}`, {
      params: {
        path: {
          id: id,
        },
      },
    });
  return useQuery({
    queryKey: offerKeys.detail(id),
    queryFn: getSpecificOffer,
    enabled: Boolean(id),
  });
}
export function useUpdateFeatured() {
  const queryClient = useQueryClient();

  // PATCH /properties/:id flips favorite while leaving all other fields untouched.
  const updateFeatured = (offer: Offer) =>
    fetchClient.PATCH<OfferResponse, UpdateFeaturedRequest>("/offers/:id", {
      params: {
        path: { id: offer.id },
      },
      body: { featured: !offer.featured },
    });

  return useMutation({
    mutationFn: updateFeatured,
    onSuccess: (offer) => {
      queryClient.invalidateQueries({
        queryKey: offerKeys.all,
      });
      queryClient.setQueryData(offerKeys.detail(String(offer.id)), offer);
    },
  });
}

export function useSearchOffers({
  search,
  page = 1,
  limit = 20,
}: {
  search: string;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: [...offerKeys.all, { search, page, limit }],

    queryFn: () =>
      fetchClient.GET<OffersResponse>("/offers", {
        params: {
          query: {
            search: search?.trim() || undefined,
            page,
            limit,
          },
        },
      }),
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Offer) =>
      fetchClient.POST<Offer, Offer>("/offers", {
        body: data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: offerKeys.all,
      });
    },
  });
}
