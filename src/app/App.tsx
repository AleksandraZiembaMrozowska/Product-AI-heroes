import { SellerView } from "./components/SellerView";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerView />
      <Toaster />
    </div>
  );
}
