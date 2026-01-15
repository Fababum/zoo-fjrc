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

function PurchaseTicketsCardInfo() {
  const location = useLocation();
  const cart: CartItem[] = (location.state && (location.state as any).cart) || [];
  const total: number = (location.state && (location.state as any).total) || 0;

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("new");

  const [cardType, setCardType] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

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
      if (!auth.token) return;
      try {
        const data = await getPaymentMethods(auth.token);
        setSavedCards(data);
      } catch (err) {
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

  const handleOrderSuccess = () => {
    pushToast("Tickets erfolgreich gekauft.", "success");
    window.setTimeout(() => {
      navigate(resolveOrdersPath());
    }, 600);
  };

  const handlePay = () => {
    if (!cardNumber && selectedCardId === "new") {
      return alert("Bitte geben Sie eine Kartennummer ein");
    }
    if (!firstName || !lastName || !street || !houseNumber || !postalCode || !city) {
      return alert("Bitte füllen Sie alle Pflichtfelder aus");
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
          last4: cardNumber.slice(-4),
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
                      onChange={e=>setCardNumber(e.target.value)}
                      maxLength={16}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ablaufdatum *
                    </label>
                    <input 
                      type="month"
                      className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                      value={expiry} 
                      onChange={e=>setExpiry(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV/CVC *
                    </label>
                    <input 
                      className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                      placeholder="123" 
                      value={cvv} 
                      onChange={e=>setCvv(e.target.value)}
                      maxLength={4}
                      type="password"
                    />
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
