import { Routes, Route } from "react-router-dom";
import { AllOffers } from "./pages/AllOffers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AllOffers />} />

      <Route path="/check/:id" element={<></>} />
      <Route path="/details/:id" element={<></>} />
    </Routes>
  );
}

export default App;
