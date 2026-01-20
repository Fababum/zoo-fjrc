import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Check, Lock, Trash2, Edit2, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { createOrder } from "@/api/orders";
import type { Order } from "@/api/orders";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from "@/api/paymentMethods";
import type { PaymentMethod } from "@/api/paymentMethods";
import { ToastViewport, useToast } from "@/components/ui/toast";

type CartItem = { title: string; price: number; qty: number };
type SavedCard = PaymentMethod;

type CardErrors = {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
};

function PurchaseTicketsCardInfo() {
  const location = useLocation();
  const cart: CartItem[] = (location.state && (location.state as any).cart) || [];
  const total: number = (location.state && (location.state as any).total) || 0;

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("new");
  const [showAuthNotice, setShowAuthNotice] = useState(false);

  const [cardType, setCardType] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<CardErrors>({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [addressExtra, setAddressExtra] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("CH");
  const [phone, setPhone] = useState("");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<SavedCard | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const { toasts, pushToast, dismissToast } = useToast();

  useEffect(() => {
    const loadCards = async () => {
      if (!auth.token) {
        setSavedCards([]);
        setShowAuthNotice(true);
        return;
      }
      try {
        const data = await getPaymentMethods(auth.token);
        setSavedCards(data);
        setShowAuthNotice(false);
      } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          setSavedCards([]);
          setShowAuthNotice(true);
          return;
        }
        console.error(err);
      }
    };

    loadCards();
  }, [auth.token]);

  useEffect(() => {
  if (selectedCardId !== "new") {
    const card = savedCards.find(c => String(c.id) === selectedCardId);
    if (card) {
      setFirstName(card.firstName);
      setLastName(card.lastName);
      setStreet(card.street);
      setHouseNumber(card.houseNumber);
      setAddressExtra(card.addressExtra);
      setPostalCode(card.postalCode);
      setCity(card.city);
      setCountry(card.country);
      setPhone(card.phone);
    }
  } else {
    // RESET bei neuer Karte
    setFirstName("");
    setLastName("");
    setStreet("");
    setHouseNumber("");
    setAddressExtra("");
    setPostalCode("");
    setCity("");
    setCountry("CH");
    setPhone("");

    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardType("visa");
    setCardErrors({});
  }
  }, [selectedCardId, savedCards]);

  const ordersStorageKey = `zoo.orders.${auth.user?.id ?? "guest"}`;

  const persistOrder = async () => {
    if (!cart.length || !auth.token) return;

    const fallbackOrder: Order = {
      id: Date.now(),
      userId: auth.user?.id ?? 0,
      items: cart,
      total,
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await createOrder(
        { items: cart, total },
        auth.token
      );
      const raw = localStorage.getItem(ordersStorageKey);
      const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
      localStorage.setItem(
        ordersStorageKey,
        JSON.stringify([created, ...parsed])
      );
    } catch {
      const raw = localStorage.getItem(ordersStorageKey);
      const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
      localStorage.setItem(
        ordersStorageKey,
        JSON.stringify([fallbackOrder, ...parsed])
      );
    }
  };

  const resolveOrdersPath = () => {
    const segment = window.location.pathname.split("/")[1];
    const isLang = ["de", "en", "fr", "it"].includes(segment);
    return isLang ? `/${segment}/orders` : "/orders";
  };

  const resolveSignInPath = () => {
    const segment = window.location.pathname.split("/")[1];
    const isLang = ["de", "en", "fr", "it"].includes(segment);
    return isLang ? `/${segment}/signIn` : "/signIn";
  };

  const handleOrderSuccess = () => {
    pushToast("Tickets erfolgreich gekauft.", "success");
    window.setTimeout(() => {
      navigate(resolveOrdersPath());
    }, 600);
  };

  const isLuhnValid = (value: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i -= 1) {
      let digit = Number(value[i]);
      if (Number.isNaN(digit)) return false;
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateCardFields = (
    values: { cardNumber: string; expiry: string; cvv: string },
    requireAll: boolean
  ): CardErrors => {
    const errors: CardErrors = {};
    const cleanedNumber = values.cardNumber.replace(/\s+/g, "");

    if (requireAll || cleanedNumber) {
      if (!cleanedNumber) {
        errors.cardNumber = "Bitte geben Sie eine Kartennummer ein";
      } else if (!/^\d{13,19}$/.test(cleanedNumber) || !isLuhnValid(cleanedNumber)) {
        errors.cardNumber = "Bitte geben Sie eine gueltige Kartennummer ein";
      }
    }

    if (requireAll || values.expiry) {
      if (!values.expiry) {
        errors.expiry = "Bitte geben Sie ein Ablaufdatum ein";
      } else {
        const [expYear, expMonth] = values.expiry.split("-").map((value) => Number(value));
        if (!expYear || !expMonth || expMonth < 1 || expMonth > 12) {
          errors.expiry = "Bitte geben Sie ein gueltiges Ablaufdatum ein";
        } else {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;
          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            errors.expiry = "Diese Karte ist abgelaufen";
          }
        }
      }
    }

    if (requireAll || values.cvv) {
      if (!values.cvv) {
        errors.cvv = "Bitte geben Sie einen CVV/CVC ein";
      } else if (!/^\d{3,4}$/.test(values.cvv)) {
        errors.cvv = "Bitte geben Sie einen gueltigen CVV/CVC ein";
      }
    }

    return errors;
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D+/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    if (selectedCardId === "new") {
      const nextErrors = validateCardFields({ cardNumber: formatted, expiry, cvv }, false);
      setCardErrors((prev) => ({ ...prev, cardNumber: nextErrors.cardNumber }));
    }
  };

  const handleExpiryChange = (value: string) => {
    setExpiry(value);
    if (selectedCardId === "new") {
      const nextErrors = validateCardFields({ cardNumber, expiry: value, cvv }, false);
      setCardErrors((prev) => ({ ...prev, expiry: nextErrors.expiry }));
    }
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/\D+/g, "").slice(0, 4);
    setCvv(digits);
    if (selectedCardId === "new") {
      const nextErrors = validateCardFields({ cardNumber, expiry, cvv: digits }, false);
      setCardErrors((prev) => ({ ...prev, cvv: nextErrors.cvv }));
    }
  };

  const handlePay = () => {
    if (!firstName || !lastName || !street || !houseNumber || !postalCode || !city) {
      return alert("Bitte f?llen Sie alle Pflichtfelder aus");
    }

    if (selectedCardId === "new") {
      const errors = validateCardFields({ cardNumber, expiry, cvv }, true);
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    console.log("Zahlung wird verarbeitet...");

    if (selectedCardId === "new" && cardNumber && expiry && cvv) {
      setShowSaveModal(true);
    } else {
      void persistOrder();
      handleOrderSuccess();
    }
  };
  const handleSaveCard = async () => {
    if (!auth.token) return;

    const [expYear, expMonth] = expiry
      ? expiry.split("-").map((value) => Number(value))
      : [0, 0];

    try {
      const created = await createPaymentMethod(
        {
          cardType,
          last4: cardNumber.replace(/\s+/g, "").slice(-4),
          expMonth,
          expYear,
          firstName,
          lastName,
          street,
          houseNumber,
          addressExtra,
          postalCode,
          city,
          country,
          phone,
        },
        auth.token
      );
      setSavedCards((prev) => [created, ...prev]);
      setShowSaveModal(false);
      void persistOrder();
      handleOrderSuccess();
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        setShowAuthNotice(true);
        return;
      }
      console.error(err);
      alert("Speichern der Karte fehlgeschlagen");
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (confirm("Möchten Sie diese Karte wirklich löschen?")) {
      if (!auth.token) return;
      try {
        await deletePaymentMethod(id, auth.token);
        const next = savedCards.filter((c) => c.id !== id);
        setSavedCards(next);
        if (String(id) === selectedCardId) {
          setSelectedCardId("new");
        }
      } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          setShowAuthNotice(true);
          return;
        }
        console.error(err);
        alert("Löschen der Karte fehlgeschlagen");
      }
    }
  };

  const handleEditCard = (card: SavedCard) => {
    setEditingCard({...card});
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;

    if (!auth.token) return;

    try {
      const updated = await updatePaymentMethod(
        editingCard.id,
        {
          cardType: editingCard.cardType,
          last4: editingCard.last4,
          expMonth: editingCard.expMonth,
          expYear: editingCard.expYear,
          firstName: editingCard.firstName,
          lastName: editingCard.lastName,
          street: editingCard.street,
          houseNumber: editingCard.houseNumber,
          addressExtra: editingCard.addressExtra,
          postalCode: editingCard.postalCode,
          city: editingCard.city,
          country: editingCard.country,
          phone: editingCard.phone,
        },
        auth.token
      );
      const next = savedCards.map((c) =>
        c.id === updated.id ? updated : c
      );
      setSavedCards(next);
      setShowEditModal(false);
      setEditingCard(null);
      alert("Änderungen gespeichert!");

      if (String(updated.id) === selectedCardId) {
        setFirstName(updated.firstName);
        setLastName(updated.lastName);
        setStreet(updated.street);
        setHouseNumber(updated.houseNumber);
        setAddressExtra(updated.addressExtra);
        setPostalCode(updated.postalCode);
        setCity(updated.city);
        setPhone(updated.phone);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        setShowAuthNotice(true);
        return;
      }
      console.error(err);
      alert("Speichern der Änderungen fehlgeschlagen");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 sm:p-10">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <Lock className="w-7 h-7" />
              <h1 className="text-2xl sm:text-3xl font-bold">Sichere Zahlung</h1>
            </div>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Ihre Daten sind durch SSL-Verschlüsselung geschützt
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {cart.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Bestellübersicht
                </h3>
                <div className="space-y-2">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.qty}x {item.title}
                      </span>
                      <span className="font-medium text-gray-900">
                        CHF {(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gray-800">CHF {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zahlungsmethode
              </label>
              {showAuthNotice && (
                <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Bitte anmelden</div>
                  <p className="mt-1">
                    Melden Sie sich an, um gespeicherte Zahlungsmethoden zu sehen und zu speichern.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(resolveSignInPath())}
                    className="mt-3 inline-flex items-center rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-all"
                  >
                    Zum Login
                  </button>
                </div>
              )}
              <select 
                className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-base focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                value={selectedCardId} 
                onChange={e=>setSelectedCardId(e.target.value)}
              >
                <option value="new">+ Neue Karte hinzufügen</option>
                {savedCards.map(c=>(
                  <option key={c.id} value={c.id}>
                    {c.cardType.toUpperCase()} •••• {c.last4} ({c.firstName} {c.lastName})
                  </option>
                ))}
              </select>
            </div>

            {savedCards.length > 0 && selectedCardId !== "new" && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Gespeicherte Karten</h3>
                {savedCards.map(card => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {card.cardType.toUpperCase()} •••• {card.last4}
                    </div>
                    <div className="text-xs text-gray-500">
                      Gültig bis {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                    </div>
                    <div className="text-sm text-gray-600">
                      {card.firstName} {card.lastName}
                    </div>
                      <div className="text-xs text-gray-500">
                        {card.street} {card.houseNumber}, {card.postalCode} {card.city}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCard(card)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all"
                        title="Bearbeiten"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCardId === "new" && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  Neue Karte
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kartentyp
                    </label>
                    <select 
                      className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                      value={cardType} 
                      onChange={e=>setCardType(e.target.value)}
                    >
                      <option value="visa">💳 Visa</option>
                      <option value="mastercard">💳 Mastercard</option>
                      <option value="amex">💳 American Express</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kartennummer *
                    </label>
                    <input 
                      className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber} 
                      onChange={e=>handleCardNumberChange(e.target.value)}
                      maxLength={23}
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                    {cardErrors.cardNumber && (
                      <p className="text-xs text-red-600 mt-1">{cardErrors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ablaufdatum *
                    </label>
                    <input 
                      type="month"
                      className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                      value={expiry} 
                      onChange={e=>handleExpiryChange(e.target.value)}
                      autoComplete="cc-exp"
                    />
                    {cardErrors.expiry && (
                      <p className="text-xs text-red-600 mt-1">{cardErrors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV/CVC *
                    </label>
                    <input 
                      className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                      placeholder="123" 
                      value={cvv} 
                      onChange={e=>handleCvvChange(e.target.value)}
                      maxLength={4}
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                    />
                    {cardErrors.cvv && (
                      <p className="text-xs text-red-600 mt-1">{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Rechnungsadresse
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vorname *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Max" 
                    value={firstName} 
                    onChange={e=>setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nachname *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Mustermann" 
                    value={lastName} 
                    onChange={e=>setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strasse *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Bahnhofstrasse" 
                    value={street} 
                    onChange={e=>setStreet(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hausnummer *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="123" 
                    value={houseNumber} 
                    onChange={e=>setHouseNumber(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresszusatz
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Wohnung, Stockwerk, etc." 
                    value={addressExtra} 
                    onChange={e=>setAddressExtra(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PLZ *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="8000" 
                    value={postalCode} 
                    onChange={e=>setPostalCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ort *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Zürich" 
                    value={city} 
                    onChange={e=>setCity(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="+41 79 123 45 67" 
                    value={phone} 
                    onChange={e=>setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button 
                onClick={handlePay}
                className="w-full h-14 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Lock className="w-5 h-5" />
                Jetzt bezahlen CHF {total.toFixed(2)}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                 Sichere Zahlung mit SSL-Verschlüsselung
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-900">Karte speichern?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Möchten Sie diese Karte und die Zahlungsinformationen für zukünftige Käufe speichern?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  void persistOrder();
                  handleOrderSuccess();
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
              >
                Nein, danke
              </button>
              <button
                onClick={handleSaveCard}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg transition-all"
              >
                Ja, speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Edit2 className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">Zahlungsinformationen bearbeiten</h3>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCard(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vorname *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.firstName} 
                    onChange={e => setEditingCard({...editingCard, firstName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nachname *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.lastName} 
                    onChange={e => setEditingCard({...editingCard, lastName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strasse *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.street} 
                    onChange={e => setEditingCard({...editingCard, street: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hausnummer *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.houseNumber} 
                    onChange={e => setEditingCard({...editingCard, houseNumber: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresszusatz
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.addressExtra} 
                    onChange={e => setEditingCard({...editingCard, addressExtra: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PLZ *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.postalCode} 
                    onChange={e => setEditingCard({...editingCard, postalCode: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ort *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.city} 
                    onChange={e => setEditingCard({...editingCard, city: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.phone} 
                    onChange={e => setEditingCard({...editingCard, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCard(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg transition-all"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default PurchaseTicketsCardInfo;
