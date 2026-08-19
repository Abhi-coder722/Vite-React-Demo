import { Routes, Route } from "react-router-dom";
import { AllOffers } from "./pages/AllOffers";
import OfferDetails from "./pages/OfferDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AllOffers />} />

      <Route path="/details/:id" element={<OfferDetails />} />
    </Routes>
  );
}

export default App;
