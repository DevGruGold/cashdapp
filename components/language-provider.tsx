"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./user-provider"

type Language = "en" | "es"

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

// Define our translations
const translations: Translations = {
  // Common
  "app.name": {
    en: "CashDapp",
    es: "CashDapp",
  },
  "common.send": {
    en: "Send",
    es: "Enviar",
  },
  "common.receive": {
    en: "Receive",
    es: "Recibir",
  },
  "common.add": {
    en: "Add",
    es: "Añadir",
  },
  "common.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "common.confirm": {
    en: "Confirm",
    es: "Confirmar",
  },
  "common.back": {
    en: "Back",
    es: "Atrás",
  },
  "common.next": {
    en: "Next",
    es: "Siguiente",
  },
  "common.save": {
    en: "Save",
    es: "Guardar",
  },
  "common.processing": {
    en: "Processing...",
    es: "Procesando...",
  },
  "common.sending": {
    en: "Sending...",
    es: "Enviando...",
  },
  "common.requesting": {
    en: "Requesting...",
    es: "Solicitando...",
  },
  "common.loading": {
    en: "Loading...",
    es: "Cargando...",
  },
  "common.success": {
    en: "Success",
    es: "Éxito",
  },
  "common.error": {
    en: "Error",
    es: "Error",
  },
  "common.completed": {
    en: "Completed",
    es: "Completado",
  },
  "common.pending": {
    en: "Pending",
    es: "Pendiente",
  },
  "common.failed": {
    en: "Failed",
    es: "Fallido",
  },
  "common.viewDetails": {
    en: "View Details",
    es: "Ver Detalles",
  },
  "common.transfer": {
    en: "Transfer",
    es: "Transferir",
  },

  // Navigation
  "nav.home": {
    en: "Home",
    es: "Inicio",
  },
  "nav.activity": {
    en: "Activity",
    es: "Actividad",
  },
  "nav.banking": {
    en: "Banking",
    es: "Banca",
  },
  "nav.terminal": {
    en: "Terminal",
    es: "Terminal",
  },
  "nav.assets": {
    en: "Assets",
    es: "Activos",
  },
  "nav.settings": {
    en: "Settings",
    es: "Ajustes",
  },

  // Home Screen
  "home.balance": {
    en: "Balance",
    es: "Saldo",
  },
  "home.sendMoney": {
    en: "Send Money",
    es: "Enviar Dinero",
  },
  "home.requestMoney": {
    en: "Request Money",
    es: "Solicitar Dinero",
  },
  "home.addFunds": {
    en: "Add Funds",
    es: "Añadir Fondos",
  },
  "home.sendMoneyDesc": {
    en: "Send money to friends, family, or businesses instantly.",
    es: "Envía dinero a amigos, familiares o negocios al instante.",
  },
  "home.requestMoneyDesc": {
    en: "Request money from friends, family, or customers.",
    es: "Solicita dinero a amigos, familiares o clientes.",
  },
  "home.addFundsDesc": {
    en: "Add funds to your account from a bank or card.",
    es: "Añade fondos a tu cuenta desde un banco o tarjeta.",
  },
  "home.tokenizeDesc": {
    en: "Convert physical assets into digital tokens.",
    es: "Convierte activos físicos en tokens digitales.",
  },

  // Banking Screen
  "banking.title": {
    en: "Banking",
    es: "Banca",
  },
  "banking.coldStorage": {
    en: "Cold Storage",
    es: "Almacenamiento Frío",
  },
  "banking.offlineTransfer": {
    en: "Offline Transfer",
    es: "Transferencia Offline",
  },
  "banking.deviceDetector": {
    en: "Device Detector",
    es: "Detector de Dispositivos",
  },
  "banking.cards": {
    en: "Cards",
    es: "Tarjetas",
  },
  "banking.crypto": {
    en: "Crypto",
    es: "Cripto",
  },
  "banking.cash": {
    en: "Cash",
    es: "Efectivo",
  },
  "banking.yourCards": {
    en: "Your Cards",
    es: "Tus Tarjetas",
  },
  "banking.managePaymentMethods": {
    en: "Manage your payment methods",
    es: "Administra tus métodos de pago",
  },
  "banking.addCard": {
    en: "Add Debit or Credit Card",
    es: "Añadir Tarjeta de Débito o Crédito",
  },
  "banking.cryptocurrency": {
    en: "Cryptocurrency",
    es: "Criptomoneda",
  },
  "banking.buySellManage": {
    en: "Buy, sell, and manage your crypto",
    es: "Compra, vende y administra tus criptomonedas",
  },
  "banking.buyCrypto": {
    en: "Buy Cryptocurrency",
    es: "Comprar Criptomoneda",
  },
  "banking.walletRequired": {
    en: "Note: Some crypto features require a connected wallet",
    es: "Nota: Algunas funciones de cripto requieren una billetera conectada",
  },
  "banking.poweredBy": {
    en: "Powered by Stripe and Alchemy",
    es: "Desarrollado por Stripe y Alchemy",
  },
  "banking.securelyStore": {
    en: "Securely store your money offline",
    es: "Almacena tu dinero de forma segura sin conexión",
  },
  "banking.coldWalletStorage": {
    en: "Cold Wallet Storage",
    es: "Almacenamiento en Billetera Fría",
  },
  "banking.transferFunds": {
    en: "Transfer funds to offline devices",
    es: "Transferir fondos a dispositivos sin conexión",
  },
  "banking.access": {
    en: "Access",
    es: "Acceder",
  },
  "banking.transfer": {
    en: "Transfer",
    es: "Transferir",
  },
  "banking.transferBetweenAccounts": {
    en: "Transfer between accounts without internet",
    es: "Transferir entre cuentas sin internet",
  },

  // Terminal
  "terminal.title": {
    en: "POS Terminal",
    es: "Terminal POS",
  },
  "terminal.description": {
    en: "Process payments with your card terminal",
    es: "Procesa pagos con tu terminal de tarjetas",
  },
  "terminal.connect": {
    en: "Connect your Bluetooth card reader or POS terminal to accept payments from customers.",
    es: "Conecta tu lector de tarjetas Bluetooth o terminal POS para aceptar pagos de clientes.",
  },
  "terminal.open": {
    en: "Open Terminal",
    es: "Abrir Terminal",
  },
  "terminal.paymentDetails": {
    en: "Payment Details",
    es: "Detalles del Pago",
  },
  "terminal.enterPaymentInfo": {
    en: "Enter the payment information",
    es: "Ingresa la información del pago",
  },
  "terminal.amount": {
    en: "Amount ($)",
    es: "Monto ($)",
  },
  "terminal.description": {
    en: "Description (Optional)",
    es: "Descripción (Opcional)",
  },
  "terminal.whatFor": {
    en: "What's it for?",
    es: "¿Para qué es?",
  },
  "terminal.qrCode": {
    en: "QR Code",
    es: "Código QR",
  },
  "terminal.nfc": {
    en: "NFC",
    es: "NFC",
  },
  "terminal.bluetooth": {
    en: "Bluetooth",
    es: "Bluetooth",
  },
  "terminal.stripe": {
    en: "Stripe",
    es: "Stripe",
  },

  // Activity
  "activity.all": {
    en: "All",
    es: "Todo",
  },
  "activity.transfers": {
    en: "Transfers",
    es: "Transferencias",
  },
  "activity.deposits": {
    en: "Deposits",
    es: "Depósitos",
  },
  "activity.withdrawals": {
    en: "Withdrawals",
    es: "Retiros",
  },
  "activity.tokenization": {
    en: "Tokenization",
    es: "Tokenización",
  },
  "activity.noTransactions": {
    en: "No transactions found.",
    es: "No se encontraron transacciones.",
  },

  // Assets
  "assets.title": {
    en: "Assets",
    es: "Activos",
  },
  "assets.tokenize": {
    en: "Tokenize Asset",
    es: "Tokenizar Activo",
  },
  "assets.tokenId": {
    en: "Token ID",
    es: "ID del Token",
  },
  "assets.noAssets": {
    en: 'No tokenized assets found. Click "Tokenize Asset" to get started.',
    es: 'No se encontraron activos tokenizados. Haz clic en "Tokenizar Activo" para comenzar.',
  },
  assets: {
    tokenize: "Tokenize Asset",
    tokenizeAsset: "Tokenize Asset",
    assetType: "Asset Type",
    selectType: "Select asset type",
    property: "Property",
    vehicle: "Vehicle",
    document: "Document",
    valuable: "Valuable",
    asset: "Asset",
    assetName: "Asset Name",
    description: "Description",
    estimatedValue: "Estimated Value (USD)",
    uploadDocuments: "Upload Documents",
    dragAndDrop: "Drag and drop files here or click to browse",
    uploadProof: "Upload proof of ownership, photos, or other relevant documents",
    browseFiles: "Browse Files",
    tokenizing: "Tokenizing...",
    enter: "Enter",
    name: "name",
    describe: "Describe your",
    missingFields: "Please fill in all required fields",
    tokenizeSuccess: "Asset Tokenized",
    tokenizeSuccessDesc: "Your asset has been successfully tokenized",
    tokenizeFailed: "Tokenization Failed",
    tokenizeFailedDesc: "There was an error tokenizing your asset",
  },

  // Settings
  "settings.title": {
    en: "Settings",
    es: "Ajustes",
  },
  "settings.profile": {
    en: "Profile",
    es: "Perfil",
  },
  "settings.security": {
    en: "Security",
    es: "Seguridad",
  },
  "settings.preferences": {
    en: "Preferences",
    es: "Preferencias",
  },
  "settings.appearance": {
    en: "Appearance",
    es: "Apariencia",
  },
  "settings.language": {
    en: "Language",
    es: "Idioma",
  },
  "settings.english": {
    en: "English",
    es: "Inglés",
  },
  "settings.spanish": {
    en: "Spanish",
    es: "Español",
  },
  "settings.wallet": {
    en: "Wallet",
    es: "Billetera",
  },
  "settings.manageWallet": {
    en: "Manage your blockchain wallet",
    es: "Administra tu billetera blockchain",
  },
  "settings.walletConnected": {
    en: "Wallet Connected",
    es: "Billetera Conectada",
  },
  "settings.connectWallet": {
    en: "Connect Wallet",
    es: "Conectar Billetera",
  },
  "settings.signOut": {
    en: "Sign Out",
    es: "Cerrar Sesión",
  },

  // Login/Register
  "auth.login": {
    en: "Login",
    es: "Iniciar Sesión",
  },
  "auth.register": {
    en: "Register",
    es: "Registrarse",
  },
  "auth.email": {
    en: "Email",
    es: "Correo Electrónico",
  },
  "auth.password": {
    en: "Password",
    es: "Contraseña",
  },
  "auth.confirmPassword": {
    en: "Confirm Password",
    es: "Confirmar Contraseña",
  },
  "auth.signIn": {
    en: "Sign in to your account",
    es: "Inicia sesión en tu cuenta",
  },
  "auth.createAccount": {
    en: "Create a new account",
    es: "Crea una nueva cuenta",
  },
  "auth.noAccount": {
    en: "Don't have an account?",
    es: "¿No tienes una cuenta?",
  },
  "auth.haveAccount": {
    en: "Already have an account?",
    es: "¿Ya tienes una cuenta?",
  },
  "auth.demoAccounts": {
    en: "Demo accounts: user1@example.com / password1 or user2@example.com / password2",
    es: "Cuentas de demostración: user1@example.com / password1 o user2@example.com / password2",
  },
  "auth.loggingIn": {
    en: "Logging in...",
    es: "Iniciando sesión...",
  },
  "auth.creatingAccount": {
    en: "Creating account...",
    es: "Creando cuenta...",
  },

  // Dialogs
  "dialog.sendMoney": {
    en: "Send money to your contacts instantly.",
    es: "Envía dinero a tus contactos al instante.",
  },
  "dialog.requestMoney": {
    en: "Request money from your contacts.",
    es: "Solicita dinero a tus contactos.",
  },
  "dialog.addFunds": {
    en: "Add funds to your account from a bank or card.",
    es: "Añade fondos a tu cuenta desde un banco o tarjeta.",
  },
  "dialog.recipient": {
    en: "Recipient",
    es: "Destinatario",
  },
  "dialog.from": {
    en: "From",
    es: "De",
  },
  "dialog.selectContact": {
    en: "Select a contact",
    es: "Selecciona un contacto",
  },
  "dialog.amount": {
    en: "Amount ($)",
    es: "Monto ($)",
  },
  "dialog.description": {
    en: "Description (Optional)",
    es: "Descripción (Opcional)",
  },
  "dialog.whatFor": {
    en: "What's it for?",
    es: "¿Para qué es?",
  },
  "dialog.sendTo": {
    en: "Send to",
    es: "Enviar a",
  },
  "dialog.requestFrom": {
    en: "Request from",
    es: "Solicitar de",
  },
  "dialog.for": {
    en: "For",
    es: "Para",
  },
  "dialog.source": {
    en: "Source",
    es: "Fuente",
  },
  "dialog.bankAccount": {
    en: "Bank Account",
    es: "Cuenta Bancaria",
  },
  "dialog.creditCard": {
    en: "Credit Card",
    es: "Tarjeta de Crédito",
  },
  "dialog.addFrom": {
    en: "Add from",
    es: "Añadir desde",
  },
  "dialog.fundsAvailable": {
    en: "Funds will be available immediately in your account.",
    es: "Los fondos estarán disponibles inmediatamente en tu cuenta.",
  },
  assets: {
    tokenize: "Tokenizar Activo",
    tokenizeAsset: "Tokenizar Activo",
    assetType: "Tipo de Activo",
    selectType: "Seleccionar tipo de activo",
    property: "Propiedad",
    vehicle: "Vehículo",
    document: "Documento",
    valuable: "Objeto de Valor",
    asset: "Activo",
    assetName: "Nombre del Activo",
    description: "Descripción",
    estimatedValue: "Valor Estimado (USD)",
    uploadDocuments: "Subir Documentos",
    dragAndDrop: "Arrastra y suelta archivos aquí o haz clic para explorar",
    uploadProof: "Sube prueba de propiedad, fotos u otros documentos relevantes",
    browseFiles: "Explorar Archivos",
    tokenizing: "Tokenizando...",
    enter: "Ingresa",
    name: "nombre",
    describe: "Describe tu",
    missingFields: "Por favor completa todos los campos requeridos",
    tokenizeSuccess: "Activo Tokenizado",
    tokenizeSuccessDesc: "Tu activo ha sido tokenizado exitosamente",
    tokenizeFailed: "Tokenización Fallida",
    tokenizeFailedDesc: "Hubo un error al tokenizar tu activo",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUser()
  const [language, setLanguageState] = useState<Language>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("cashdapp_language")
    if (storedLanguage === "en" || storedLanguage === "es") {
      setLanguageState(storedLanguage)
    }
  }, [])

  // Load user preference when user changes
  useEffect(() => {
    if (currentUser?.id) {
      const userPreferences = JSON.parse(localStorage.getItem(`cashdapp_preferences_${currentUser.id}`) || "{}")
      if (userPreferences.language === "en" || userPreferences.language === "es") {
        setLanguageState(userPreferences.language)
      }
    }
  }, [currentUser])

  // Save language preference to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("cashdapp_language", newLanguage)

    // Update user preference if logged in
    if (currentUser) {
      const userPreferences = JSON.parse(localStorage.getItem(`cashdapp_preferences_${currentUser.id}`) || "{}")
      localStorage.setItem(
        `cashdapp_preferences_${currentUser.id}`,
        JSON.stringify({
          ...userPreferences,
          language: newLanguage,
        }),
      )
    }
  }

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language]
    }

    // Fallback to English if translation not found
    if (translations[key] && translations[key]["en"]) {
      return translations[key]["en"]
    }

    // Return the key if no translation found
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
