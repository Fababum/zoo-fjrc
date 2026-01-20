import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { TranslationsContext } from "../TranslationsContext";

type CartItem = { title: string; price: number; qty: number };
type SavedCard = PaymentMethod;

type CardErrors = {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
};

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const resolveLang = (contextLang?: string, routeLang?: string): SupportedLang => {
  if ((SUPPORTED_LANGS as readonly string[]).includes(contextLang ?? "")) {
    return contextLang as SupportedLang;
  }
  if ((SUPPORTED_LANGS as readonly string[]).includes(routeLang ?? "")) {
    return routeLang as SupportedLang;
  }
  return "de";
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
  const context = useContext(TranslationsContext);
  const { lang: routeLang } = useParams<{ lang?: string }>();
  const activeLang = resolveLang(context?.lang, routeLang);
  const t = {
    toastSuccess: { de: "Tickets erfolgreich gekauft.", en: "Tickets purchased successfully.", fr: "Billets achetes avec succes.", it: "Biglietti acquistati con successo." },
    cardNumberRequired: { de: "Bitte geben Sie eine Kartennummer ein", en: "Please enter a card number", fr: "Veuillez saisir un numero de carte", it: "Inserisci un numero di carta" },
    cardNumberInvalid: { de: "Bitte geben Sie eine gueltige Kartennummer ein", en: "Please enter a valid card number", fr: "Veuillez saisir un numero de carte valide", it: "Inserisci un numero di carta valido" },
    expiryRequired: { de: "Bitte geben Sie ein Ablaufdatum ein", en: "Please enter an expiry date", fr: "Veuillez saisir une date d'expiration", it: "Inserisci una data di scadenza" },
    expiryInvalid: { de: "Bitte geben Sie ein gueltiges Ablaufdatum ein", en: "Please enter a valid expiry date", fr: "Veuillez saisir une date d'expiration valide", it: "Inserisci una data di scadenza valida" },
    expiryPast: { de: "Diese Karte ist abgelaufen", en: "This card has expired", fr: "Cette carte a expire", it: "Questa carta e scaduta" },
    cvvRequired: { de: "Bitte geben Sie einen CVV/CVC ein", en: "Please enter a CVV/CVC", fr: "Veuillez saisir un CVV/CVC", it: "Inserisci un CVV/CVC" },
    cvvInvalid: { de: "Bitte geben Sie einen gueltigen CVV/CVC ein", en: "Please enter a valid CVV/CVC", fr: "Veuillez saisir un CVV/CVC valide", it: "Inserisci un CVV/CVC valido" },
    requiredFields: { de: "Bitte fuellen Sie alle Pflichtfelder aus", en: "Please fill in all required fields", fr: "Veuillez remplir tous les champs obligatoires", it: "Compila tutti i campi obbligatori" },
    paymentProcessing: { de: "Zahlung wird verarbeitet...", en: "Payment is being processed...", fr: "Le paiement est en cours...", it: "Pagamento in corso..." },
    saveCardFailed: { de: "Speichern der Karte fehlgeschlagen", en: "Failed to save the card", fr: "Echec de l'enregistrement de la carte", it: "Salvataggio carta non riuscito" },
    deleteCardConfirm: { de: "Moechten Sie diese Karte wirklich loeschen?", en: "Do you really want to delete this card?", fr: "Voulez-vous vraiment supprimer cette carte ?", it: "Vuoi davvero eliminare questa carta?" },
    deleteCardFailed: { de: "Loeschen der Karte fehlgeschlagen", en: "Failed to delete the card", fr: "Echec de la suppression de la carte", it: "Eliminazione della carta non riuscita" },
    editSaved: { de: "Aenderungen gespeichert!", en: "Changes saved!", fr: "Modifications enregistrees !", it: "Modifiche salvate!" },
    editSaveFailed: { de: "Speichern der Aenderungen fehlgeschlagen", en: "Failed to save changes", fr: "Echec de l'enregistrement des modifications", it: "Salvataggio modifiche non riuscito" },
    securePayment: { de: "Sichere Zahlung", en: "Secure payment", fr: "Paiement securise", it: "Pagamento sicuro" },
    secureSubtitle: { de: "Ihre Daten sind durch SSL-Verschluesselung geschuetzt", en: "Your data is protected by SSL encryption", fr: "Vos donnees sont protegees par chiffrement SSL", it: "I tuoi dati sono protetti da cifratura SSL" },
    orderSummary: { de: "Bestelluebersicht", en: "Order summary", fr: "Recapitulatif", it: "Riepilogo ordine" },
    totalLabel: { de: "Total", en: "Total", fr: "Total", it: "Totale" },
    paymentMethod: { de: "Zahlungsmethode", en: "Payment method", fr: "Moyen de paiement", it: "Metodo di pagamento" },
    authNoticeTitle: { de: "Bitte anmelden", en: "Please sign in", fr: "Veuillez vous connecter", it: "Effettua l'accesso" },
    authNoticeBody: { de: "Melden Sie sich an, um gespeicherte Zahlungsmethoden zu sehen und zu speichern.", en: "Sign in to view and save payment methods.", fr: "Connectez-vous pour voir et enregistrer les moyens de paiement.", it: "Accedi per vedere e salvare i metodi di pagamento." },
    goToLogin: { de: "Zum Login", en: "Go to login", fr: "Se connecter", it: "Vai al login" },
    newCard: { de: "+ Neue Karte hinzufuegen", en: "+ Add new card", fr: "+ Ajouter une carte", it: "+ Aggiungi carta" },
    savedCards: { de: "Gespeicherte Karten", en: "Saved cards", fr: "Cartes enregistrees", it: "Carte salvate" },
    validUntil: { de: "Gueltig bis", en: "Valid until", fr: "Valable jusqu'a", it: "Valida fino a" },
    edit: { de: "Bearbeiten", en: "Edit", fr: "Modifier", it: "Modifica" },
    delete: { de: "Loeschen", en: "Delete", fr: "Supprimer", it: "Elimina" },
    newCardTitle: { de: "Neue Karte", en: "New card", fr: "Nouvelle carte", it: "Nuova carta" },
    cardType: { de: "Kartentyp", en: "Card type", fr: "Type de carte", it: "Tipo di carta" },
    cardNumber: { de: "Kartennummer", en: "Card number", fr: "Numero de carte", it: "Numero carta" },
    expiry: { de: "Ablaufdatum", en: "Expiry date", fr: "Date d'expiration", it: "Scadenza" },
    cvv: { de: "CVV/CVC", en: "CVV/CVC", fr: "CVV/CVC", it: "CVV/CVC" },
    billing: { de: "Rechnungsadresse", en: "Billing address", fr: "Adresse de facturation", it: "Indirizzo di fatturazione" },
    firstName: { de: "Vorname", en: "First name", fr: "Prenom", it: "Nome" },
    lastName: { de: "Nachname", en: "Last name", fr: "Nom", it: "Cognome" },
    street: { de: "Strasse", en: "Street", fr: "Rue", it: "Via" },
    houseNumber: { de: "Hausnummer", en: "House number", fr: "Numero", it: "Numero civico" },
    addressExtra: { de: "Adresszusatz", en: "Address extra", fr: "Complement d'adresse", it: "Dettagli indirizzo" },
    postalCode: { de: "PLZ", en: "Postal code", fr: "Code postal", it: "CAP" },
    city: { de: "Ort", en: "City", fr: "Ville", it: "Citta" },
    phone: { de: "Telefonnummer", en: "Phone", fr: "Telephone", it: "Telefono" },
    payNow: { de: "Jetzt bezahlen", en: "Pay now", fr: "Payer maintenant", it: "Paga ora" },
    secureFooter: { de: "Sichere Zahlung mit SSL-Verschluesselung", en: "Secure payment with SSL encryption", fr: "Paiement securise par SSL", it: "Pagamento sicuro con SSL" },
    saveCardTitle: { de: "Karte speichern?", en: "Save card?", fr: "Enregistrer la carte ?", it: "Salvare la carta?" },
    saveCardBody: { de: "Moechten Sie diese Karte und die Zahlungsinformationen fuer zukuenftige Kaeufe speichern?", en: "Would you like to save this card and payment info for future purchases?", fr: "Souhaitez-vous enregistrer cette carte et les infos de paiement pour l'avenir ?", it: "Vuoi salvare questa carta e le info di pagamento per il futuro?" },
    noThanks: { de: "Nein, danke", en: "No, thanks", fr: "Non, merci", it: "No, grazie" },
    yesSave: { de: "Ja, speichern", en: "Yes, save", fr: "Oui, enregistrer", it: "Si, salva" },
    editPaymentTitle: { de: "Zahlungsinformationen bearbeiten", en: "Edit payment information", fr: "Modifier les informations de paiement", it: "Modifica informazioni di pagamento" },
    cancel: { de: "Abbrechen", en: "Cancel", fr: "Annuler", it: "Annulla" },
    save: { de: "Speichern", en: "Save", fr: "Enregistrer", it: "Salva" },
    placeholderFirstName: { de: "Max", en: "John", fr: "Jean", it: "Mario" },
    placeholderLastName: { de: "Mustermann", en: "Doe", fr: "Dupont", it: "Rossi" },
    placeholderStreet: { de: "Bahnhofstrasse", en: "Main Street", fr: "Rue Centrale", it: "Via Centrale" },
    placeholderHouseNumber: { de: "123", en: "123", fr: "123", it: "123" },
    placeholderAddressExtra: { de: "Wohnung, Stockwerk, etc.", en: "Apartment, floor, etc.", fr: "Appartement, etage, etc.", it: "Appartamento, piano, ecc." },
    placeholderPostalCode: { de: "8000", en: "8000", fr: "8000", it: "8000" },
    placeholderCity: { de: "Zuerich", en: "Zurich", fr: "Zurich", it: "Zurigo" },
    placeholderPhone: { de: "+41 79 123 45 67", en: "+41 79 123 45 67", fr: "+41 79 123 45 67", it: "+41 79 123 45 67" },
  } as const;

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
    pushToast(t.toastSuccess[activeLang], "success");
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
        errors.cardNumber = t.cardNumberRequired[activeLang];
      } else if (!/^\d{13,19}$/.test(cleanedNumber) || !isLuhnValid(cleanedNumber)) {
        errors.cardNumber = t.cardNumberInvalid[activeLang];
      }
    }

    if (requireAll || values.expiry) {
      if (!values.expiry) {
        errors.expiry = t.expiryRequired[activeLang];
      } else {
        const [expYear, expMonth] = values.expiry.split("-").map((value) => Number(value));
        if (!expYear || !expMonth || expMonth < 1 || expMonth > 12) {
          errors.expiry = t.expiryInvalid[activeLang];
        } else {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;
          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            errors.expiry = t.expiryPast[activeLang];
          }
        }
      }
    }

    if (requireAll || values.cvv) {
      if (!values.cvv) {
        errors.cvv = t.cvvRequired[activeLang];
      } else if (!/^\d{3,4}$/.test(values.cvv)) {
        errors.cvv = t.cvvInvalid[activeLang];
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
      return alert(t.requiredFields[activeLang]);
    }

    if (selectedCardId === "new") {
      const errors = validateCardFields({ cardNumber, expiry, cvv }, true);
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    console.log(t.paymentProcessing[activeLang]);

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
      alert(t.saveCardFailed[activeLang]);
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (confirm(t.deleteCardConfirm[activeLang])) {
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
      alert("{t.save[activeLang]} der Änderungen fehlgeschlagen");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 sm:p-10">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <Lock className="w-7 h-7" />
              <h1 className="text-2xl sm:text-3xl font-bold">{t.securePayment[activeLang]}</h1>
            </div>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">{t.secureSubtitle[activeLang]}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {cart.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.orderSummary[activeLang]}</h3>
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
                    <span>{t.totalLabel[activeLang]}</span>
                    <span className="text-gray-800">CHF {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.paymentMethod[activeLang]}
              </label>
              {showAuthNotice && (
                <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">{t.authNoticeTitle[activeLang]}</div>
                  <p className="mt-1">
                    {t.authNoticeBody[activeLang]}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(resolveSignInPath())}
                    className="mt-3 inline-flex items-center rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-all"
                  >
                    {t.goToLogin[activeLang]}
                  </button>
                </div>
              )}
              <select 
                className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-base focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                value={selectedCardId} 
                onChange={e=>setSelectedCardId(e.target.value)}
              >
                <option value="new">+ {t.newCardTitle[activeLang]} hinzufügen</option>
                {savedCards.map(c=>(
                  <option key={c.id} value={c.id}>
                    {c.cardType.toUpperCase()} •••• {c.last4} ({c.firstName} {c.lastName})
                  </option>
                ))}
              </select>
            </div>

            {savedCards.length > 0 && selectedCardId !== "new" && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">{t.savedCards[activeLang]}</h3>
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
                        title={t.edit[activeLang]}
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
                  {t.newCardTitle[activeLang]}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.cardType[activeLang]}
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
                      {t.cardNumber[activeLang]} *
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
                      {t.expiry[activeLang]} *
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
                {t.billing[activeLang]}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.firstName[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderFirstName[activeLang]} 
                    value={firstName} 
                    onChange={e=>setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.lastName[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderLastName[activeLang]} 
                    value={lastName} 
                    onChange={e=>setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.street[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderStreet[activeLang]} 
                    value={street} 
                    onChange={e=>setStreet(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.houseNumber[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderHouseNumber[activeLang]} 
                    value={houseNumber} 
                    onChange={e=>setHouseNumber(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.addressExtra[activeLang]}
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderAddressExtra[activeLang]} 
                    value={addressExtra} 
                    onChange={e=>setAddressExtra(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postalCode[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderPostalCode[activeLang]} 
                    value={postalCode} 
                    onChange={e=>setPostalCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.city[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderCity[activeLang]} 
                    value={city} 
                    onChange={e=>setCity(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phone[activeLang]}
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder={t.placeholderPhone[activeLang]} 
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
                {t.payNow[activeLang]} CHF {total.toFixed(2)}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                {t.secureFooter[activeLang]}
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
              <h3 className="text-xl font-bold text-gray-900">{t.saveCardTitle[activeLang]}</h3>
            </div>
            <p className="text-gray-600 mb-6">{t.saveCardBody[activeLang]}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  void persistOrder();
                  handleOrderSuccess();
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
              >
                {t.noThanks[activeLang]}
              </button>
              <button
                onClick={handleSaveCard}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg transition-all"
              >
                {t.yesSave[activeLang]}
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
                <h3 className="text-xl font-bold text-gray-900">{t.editPaymentTitle[activeLang]}</h3>
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
                    {t.firstName[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.firstName} 
                    onChange={e => setEditingCard({...editingCard, firstName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.lastName[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.lastName} 
                    onChange={e => setEditingCard({...editingCard, lastName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.street[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.street} 
                    onChange={e => setEditingCard({...editingCard, street: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.houseNumber[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.houseNumber} 
                    onChange={e => setEditingCard({...editingCard, houseNumber: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.addressExtra[activeLang]}
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.addressExtra} 
                    onChange={e => setEditingCard({...editingCard, addressExtra: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postalCode[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.postalCode} 
                    onChange={e => setEditingCard({...editingCard, postalCode: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.city[activeLang]} *
                  </label>
                  <input 
                    className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all"
                    value={editingCard.city} 
                    onChange={e => setEditingCard({...editingCard, city: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phone[activeLang]}
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
                {t.cancel[activeLang]}
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg transition-all"
              >
                {t.save[activeLang]}
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
