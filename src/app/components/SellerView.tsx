import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { TrendingUp, Pause, Play, Settings, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SellerListing {
  id: string;
  title: string;
  price: number;
  image: string;
  promoted: boolean;
  promotionStatus?: "active" | "paused" | "budget_depleted";
  maxCPC?: number;
  dailyBudget?: number;
  clicks?: number;
  spent?: number;
}

const mockSellerListings: SellerListing[] = [
  {
    id: "1",
    title: "Streetwear hoodie czarna oversize",
    price: 159,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    promoted: true,
    promotionStatus: "active",
    maxCPC: 0.75,
    dailyBudget: 15,
    clicks: 24,
    spent: 18.50
  },
  {
    id: "2",
    title: "Buty sportowe Nike Air Max",
    price: 449,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    promoted: false
  },
  {
    id: "3",
    title: "Kurtka bomber vintage",
    price: 289,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    promoted: true,
    promotionStatus: "paused",
    maxCPC: 0.60,
    dailyBudget: 10,
    clicks: 12,
    spent: 7.20
  },
  {
    id: "4",
    title: "T-shirt graphic print",
    price: 79,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    promoted: false
  },
  {
    id: "5",
    title: "Spodnie cargo khaki",
    price: 199,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop",
    promoted: false
  },
];

export function SellerView() {
  const [listings, setListings] = useState<SellerListing[]>(mockSellerListings);
  const [selectedListing, setSelectedListing] = useState<SellerListing | null>(null);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showFakedoorDialog, setShowFakedoorDialog] = useState(false);
  const [maxCPC, setMaxCPC] = useState(0.65);
  const [dailyBudget, setDailyBudget] = useState(10);
  const [balance] = useState(150.00);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const averageCPC = 0.65;
  const estimatedClicks = Math.floor(dailyBudget / maxCPC);

  const handlePromote = (listing: SellerListing) => {
    setSelectedListing(listing);
    if (listing.promoted) {
      setMaxCPC(listing.maxCPC || 0.65);
      setDailyBudget(listing.dailyBudget || 10);
    }
    setShowPromoteDialog(true);
  };

  const handleConfirmPromotion = () => {
    console.log("Fakedoor - Seller interested in promotion:", {
      listing: selectedListing,
      maxCPC,
      dailyBudget,
      timestamp: new Date().toISOString()
    });

    setShowPromoteDialog(false);
    setShowFakedoorDialog(true);
    setNotificationEmail("");
    setEmailSubmitted(false);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Fakedoor - Email captured for notification:", {
      email: notificationEmail,
      listing: selectedListing,
      maxCPC,
      dailyBudget,
      timestamp: new Date().toISOString()
    });

    setEmailSubmitted(true);
    toast.success("Dziękujemy! Powiadomimy Cię gdy funkcja będzie dostępna.");

    setTimeout(() => {
      setShowFakedoorDialog(false);
      setSelectedListing(null);
    }, 2000);
  };

  const handleTogglePromotion = (listing: SellerListing) => {
    setListings(listings.map(l =>
      l.id === listing.id
        ? { ...l, promotionStatus: l.promotionStatus === "active" ? "paused" : "active" }
        : l
    ));
  };

  const promotedCount = listings.filter(l => l.promoted).length;
  const maxPromoted = 5;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Moje Oferty</h1>
            <p className="text-sm text-gray-600">
              Promowane oferty: {promotedCount}/{maxPromoted} | Saldo: {balance.toFixed(2)} PLN
            </p>
          </div>
          <Button variant="outline">
            Doładuj konto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <SellerListingCard
            key={listing.id}
            listing={listing}
            onPromote={handlePromote}
            onToggle={handleTogglePromotion}
            disabled={!listing.promoted && promotedCount >= maxPromoted}
            lowBalance={balance < 10}
          />
        ))}
      </div>

      <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedListing?.promoted ? "Edytuj promowanie" : "Promuj ofertę"}
            </DialogTitle>
            <DialogDescription>
              {selectedListing?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-600" />
                <span className="text-sm text-blue-900">Średni CPC w tej kategorii: {averageCPC.toFixed(2)} PLN</span>
              </div>
              <p className="text-xs text-blue-700">
                Prognozowany koszt kliknięcia przy Twojej stawce
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-cpc">Maksymalny koszt kliknięcia (CPC)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="max-cpc"
                  value={[maxCPC]}
                  onValueChange={([value]) => setMaxCPC(value)}
                  min={0.5}
                  max={2}
                  step={0.05}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={maxCPC.toFixed(2)}
                  onChange={(e) => setMaxCPC(parseFloat(e.target.value))}
                  step={0.05}
                  min={0.5}
                  max={2}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">PLN</span>
              </div>
              <p className="text-xs text-gray-500">
                Minimalna stawka: 0.50 PLN
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily-budget">Budżet dzienny</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="daily-budget"
                  value={[dailyBudget]}
                  onValueChange={([value]) => setDailyBudget(value)}
                  min={5}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(parseInt(e.target.value))}
                  step={5}
                  min={5}
                  max={100}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">PLN</span>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 text-sm">Prognoza</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Szacowana liczba kliknięć dziennie:</span>
                  <span>{estimatedClicks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wydatek dzienny:</span>
                  <span>do {dailyBudget.toFixed(2)} PLN</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoteDialog(false)}>
              Anuluj
            </Button>
            <Button onClick={handleConfirmPromotion}>
              {selectedListing?.promoted ? "Zapisz zmiany" : "Zgadzam się"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFakedoorDialog} onOpenChange={setShowFakedoorDialog}>
        <DialogContent className="sm:max-w-md">
          {!emailSubmitted ? (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100">
                  <Sparkles className="size-6 text-amber-600" />
                </div>
                <DialogTitle className="text-center">
                  Funkcja jeszcze nie jest dostępna
                </DialogTitle>
                <DialogDescription className="text-center">
                  Promowane Oferty są obecnie w fazie testów. Zostaw swój email,
                  a powiadomimy Cię gdy funkcja będzie gotowa do użycia.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleNotificationSubmit} className="space-y-4 py-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 text-sm text-blue-900">Twoje ustawienia zostały zapisane:</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div className="flex justify-between">
                      <span>Max CPC:</span>
                      <span>{maxCPC.toFixed(2)} PLN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budżet dzienny:</span>
                      <span>{dailyBudget} PLN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Oferta:</span>
                      <span className="max-w-[200px] truncate">{selectedListing?.title}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-email">Email do powiadomienia*</Label>
                  <Input
                    id="notification-email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Wyślemy Ci wiadomość gdy funkcja będzie dostępna
                  </p>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-col">
                  <Button type="submit" className="w-full">
                    Powiadom mnie o starcie
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowFakedoorDialog(false);
                      setSelectedListing(null);
                    }}
                    className="w-full"
                  >
                    Zamknij
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="size-6 text-green-600" />
                </div>
                <DialogTitle className="text-center">
                  Dziękujemy!
                </DialogTitle>
                <DialogDescription className="text-center">
                  Zapisaliśmy Twoje dane. Powiadomimy Cię na adres <strong>{notificationEmail}</strong> gdy
                  Promowane Oferty będą dostępne.
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SellerListingCardProps {
  listing: SellerListing;
  onPromote: (listing: SellerListing) => void;
  onToggle: (listing: SellerListing) => void;
  disabled?: boolean;
  lowBalance?: boolean;
}

function SellerListingCard({ listing, onPromote, onToggle, disabled, lowBalance }: SellerListingCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={listing.image}
          alt={listing.title}
          className="size-full object-cover"
        />
        {listing.promoted && (
          <Badge
            className={`absolute left-2 top-2 ${
              listing.promotionStatus === "active"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600"
            } text-white`}
          >
            {listing.promotionStatus === "active" ? "Aktywne" : "Wstrzymane"}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2">{listing.title}</h3>
        <p className="mb-3">{listing.price} PLN</p>

        {listing.promoted && (
          <div className="mb-3 rounded-lg bg-gray-50 p-3 text-xs">
            <div className="mb-1 flex justify-between">
              <span className="text-gray-600">Kliknięcia:</span>
              <span>{listing.clicks}</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="text-gray-600">Wydane:</span>
              <span>{listing.spent?.toFixed(2)} PLN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budżet dzienny:</span>
              <span>{listing.dailyBudget} PLN</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {listing.promoted ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggle(listing)}
                className="flex-1"
              >
                {listing.promotionStatus === "active" ? (
                  <>
                    <Pause className="mr-2 size-4" />
                    Wstrzymaj
                  </>
                ) : (
                  <>
                    <Play className="mr-2 size-4" />
                    Wznów
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPromote(listing)}
              >
                <Settings className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              size="sm"
              onClick={() => onPromote(listing)}
              disabled={disabled || lowBalance}
            >
              {lowBalance ? "Doładuj konto" : disabled ? "Limit osiągnięty" : "Promuj"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
