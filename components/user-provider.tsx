"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Define user types
export type User = {
  id: string
  name: string
  email: string
  balance: number
  avatar?: string
  preferences?: {
    language?: "en" | "es"
  }
}

export type Transaction = {
  id: string
  amount: number
  type: "payment" | "transfer" | "deposit" | "withdrawal" | "tokenization"
  description: string
  date: Date
  status: "completed" | "pending" | "failed"
  fromUserId?: string
  toUserId?: string
}

type UserContextType = {
  currentUser: User | null
  isLoading: boolean
  isAuthenticated: boolean
  transactions: Transaction[]
  contacts: User[]
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  logout: () => void
  sendMoney: (toUserId: string, amount: number, description?: string) => Promise<boolean>
  requestMoney: (fromUserId: string, amount: number, description?: string) => Promise<boolean>
  depositFunds: (amount: number, source: string) => Promise<boolean>
  withdrawFunds: (amount: number, destination: string) => Promise<boolean>
  addContact: (user: User) => void
  acceptRequest: (transactionId: string) => Promise<boolean>
  rejectRequest: (transactionId: string) => Promise<boolean>
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: false,
  isAuthenticated: false,
  transactions: [],
  contacts: [],
  login: async () => false,
  register: async () => false,
  logout: () => {},
  sendMoney: async () => false,
  requestMoney: async () => false,
  depositFunds: async () => false,
  withdrawFunds: async () => false,
  addContact: () => {},
  acceptRequest: async () => false,
  rejectRequest: async () => false,
})

// Default users
const DEFAULT_USERS: User[] = [
  { id: "user1", name: "John Doe", email: "user1@example.com", balance: 1250.75 },
  { id: "user2", name: "Jane Smith", email: "user2@example.com", balance: 850.25 },
]

// Default passwords (in a real app, these would be hashed)
const DEFAULT_PASSWORDS: Record<string, string> = {
  "user1@example.com": "password1",
  "user2@example.com": "password2",
}

// Default transactions
const generateDefaultTransactions = () => {
  const now = new Date()

  // John's transactions
  const johnTransactions: Transaction[] = [
    {
      id: "t1",
      amount: 50,
      type: "transfer",
      description: "Dinner payment",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "completed",
      fromUserId: "user1",
      toUserId: "user2",
    },
    {
      id: "t2",
      amount: 200,
      type: "deposit",
      description: "Deposit from Bank Account",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: "completed",
    },
    {
      id: "t3",
      amount: 75.5,
      type: "withdrawal",
      description: "Withdrawal to Cold Storage",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: "completed",
    },
    {
      id: "t4",
      amount: 25,
      type: "transfer",
      description: "Coffee and snacks",
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: "pending",
      fromUserId: "user2",
      toUserId: "user1",
    },
  ]

  // Jane's transactions
  const janeTransactions: Transaction[] = [
    {
      id: "t5",
      amount: 50,
      type: "transfer",
      description: "Dinner payment",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "completed",
      fromUserId: "user1",
      toUserId: "user2",
    },
    {
      id: "t6",
      amount: 150,
      type: "deposit",
      description: "Deposit from Credit Card",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "completed",
    },
    {
      id: "t7",
      amount: 25,
      type: "transfer",
      description: "Coffee and snacks",
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: "pending",
      fromUserId: "user2",
      toUserId: "user1",
    },
  ]

  return {
    user1: johnTransactions,
    user2: janeTransactions,
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [contacts, setContacts] = useState<User[]>([])
  const { toast } = useToast()

  // Initialize local storage with default users if not already set
  useEffect(() => {
    // Check if users exist in local storage
    const storedUsers = localStorage.getItem("cashdapp_users")
    if (!storedUsers) {
      // Initialize with default users
      localStorage.setItem("cashdapp_users", JSON.stringify(DEFAULT_USERS))
    }

    // Check if passwords exist in local storage
    const storedPasswords = localStorage.getItem("cashdapp_passwords")
    if (!storedPasswords) {
      // Initialize with default passwords
      localStorage.setItem("cashdapp_passwords", JSON.stringify(DEFAULT_PASSWORDS))
    }

    // Initialize default transactions if they don't exist
    const defaultTransactions = generateDefaultTransactions()

    if (!localStorage.getItem("cashdapp_transactions_user1")) {
      localStorage.setItem("cashdapp_transactions_user1", JSON.stringify(defaultTransactions.user1))
    }

    if (!localStorage.getItem("cashdapp_transactions_user2")) {
      localStorage.setItem("cashdapp_transactions_user2", JSON.stringify(defaultTransactions.user2))
    }

    // Check for stored session
    const storedSession = localStorage.getItem("cashdapp_session")
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        setCurrentUser(session.user)
        setIsAuthenticated(true)

        // Load user-specific transactions
        loadUserTransactions(session.user.id)

        // Load contacts (all users except current user)
        loadContacts(session.user.id)
      } catch (error) {
        console.error("Error restoring session:", error)
        localStorage.removeItem("cashdapp_session")
      }
    }
  }, [])

  // Load user transactions from local storage
  const loadUserTransactions = (userId: string) => {
    const storedTransactions = localStorage.getItem(`cashdapp_transactions_${userId}`)
    if (storedTransactions) {
      try {
        // Parse transactions and convert date strings back to Date objects
        const parsedTransactions = JSON.parse(storedTransactions, (key, value) => {
          if (key === "date") return new Date(value)
          return value
        })
        setTransactions(parsedTransactions)
      } catch (error) {
        console.error("Error loading transactions:", error)
        setTransactions([])
      }
    } else {
      setTransactions([])
    }
  }

  // Load contacts (all users except current user)
  const loadContacts = (currentUserId: string) => {
    const storedUsers = localStorage.getItem("cashdapp_users")
    if (storedUsers) {
      try {
        const allUsers = JSON.parse(storedUsers) as User[]
        setContacts(allUsers.filter((user) => user.id !== currentUserId))
      } catch (error) {
        console.error("Error loading contacts:", error)
        setContacts([])
      }
    }
  }

  // Save transactions to local storage
  const saveTransactions = (userId: string, updatedTransactions: Transaction[]) => {
    localStorage.setItem(`cashdapp_transactions_${userId}`, JSON.stringify(updatedTransactions))
  }

  // Update user in local storage
  const updateUser = (user: User) => {
    const storedUsers = localStorage.getItem("cashdapp_users")
    if (storedUsers) {
      try {
        const allUsers = JSON.parse(storedUsers) as User[]
        const updatedUsers = allUsers.map((u) => (u.id === user.id ? user : u))
        localStorage.setItem("cashdapp_users", JSON.stringify(updatedUsers))

        // If this is the current user, update the session
        if (currentUser && currentUser.id === user.id) {
          setCurrentUser(user)
          localStorage.setItem("cashdapp_session", JSON.stringify({ user }))
        }

        // Update contacts if needed
        if (currentUser && currentUser.id !== user.id) {
          setContacts((prev) => prev.map((c) => (c.id === user.id ? user : c)))
        }
      } catch (error) {
        console.error("Error updating user:", error)
      }
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get users and passwords from local storage
      const storedUsers = localStorage.getItem("cashdapp_users")
      const storedPasswords = localStorage.getItem("cashdapp_passwords")

      if (!storedUsers || !storedPasswords) {
        throw new Error("User data not found")
      }

      const users = JSON.parse(storedUsers) as User[]
      const passwords = JSON.parse(storedPasswords) as Record<string, string>

      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      // Check if user exists and password matches
      if (user && passwords[email.toLowerCase()] === password) {
        setCurrentUser(user)
        setIsAuthenticated(true)

        // Load user preferences if they exist
        const userPreferences = localStorage.getItem(`cashdapp_preferences_${user.id}`)
        if (userPreferences) {
          try {
            const preferences = JSON.parse(userPreferences)
            setCurrentUser((prev) => ({
              ...prev!,
              preferences,
            }))
          } catch (error) {
            console.error("Error loading user preferences:", error)
          }
        }

        // Save session to local storage
        localStorage.setItem("cashdapp_session", JSON.stringify({ user }))

        // Load user-specific transactions
        loadUserTransactions(user.id)

        // Load contacts (all users except current user)
        loadContacts(user.id)

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        })

        return true
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Error during login:", error)
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get users and passwords from local storage
      const storedUsers = localStorage.getItem("cashdapp_users")
      const storedPasswords = localStorage.getItem("cashdapp_passwords")

      if (!storedUsers || !storedPasswords) {
        throw new Error("User data not found")
      }

      const users = JSON.parse(storedUsers) as User[]
      const passwords = JSON.parse(storedPasswords) as Record<string, string>

      // Check if email already exists
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        toast({
          title: "Registration Failed",
          description: "Email already in use",
          variant: "destructive",
        })
        return false
      }

      // Create new user
      const newUser: User = {
        id: `user${Date.now()}`,
        name: email.split("@")[0], // Use part of email as name
        email: email.toLowerCase(),
        balance: 100, // Start with $100 balance
      }

      // Update users and passwords
      const updatedUsers = [...users, newUser]
      const updatedPasswords = { ...passwords, [email.toLowerCase()]: password }

      // Save to local storage
      localStorage.setItem("cashdapp_users", JSON.stringify(updatedUsers))
      localStorage.setItem("cashdapp_passwords", JSON.stringify(updatedPasswords))

      // Log in the new user
      setCurrentUser(newUser)
      setIsAuthenticated(true)

      // Save session to local storage
      localStorage.setItem("cashdapp_session", JSON.stringify({ user: newUser }))

      // Initialize empty transactions for new user
      setTransactions([])
      saveTransactions(newUser.id, [])

      // Load contacts (all users except current user)
      loadContacts(newUser.id)

      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      })

      return true
    } catch (error) {
      console.error("Error during registration:", error)
      toast({
        title: "Registration Error",
        description: "An error occurred during registration",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setTransactions([])

    // Remove session from local storage
    localStorage.removeItem("cashdapp_session")

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
  }

  const sendMoney = async (toUserId: string, amount: number, description?: string): Promise<boolean> => {
    if (!currentUser) return false

    setIsLoading(true)

    try {
      // Check if user has enough balance
      if (currentUser.balance < amount) {
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough funds to complete this transfer",
          variant: "destructive",
        })
        return false
      }

      // Get recipient user
      const storedUsers = localStorage.getItem("cashdapp_users")
      if (!storedUsers) {
        throw new Error("User data not found")
      }

      const users = JSON.parse(storedUsers) as User[]
      const recipientUser = users.find((u) => u.id === toUserId)

      if (!recipientUser) {
        throw new Error("Recipient not found")
      }

      // Update sender balance
      const updatedSender = {
        ...currentUser,
        balance: currentUser.balance - amount,
      }

      // Update recipient balance
      const updatedRecipient = {
        ...recipientUser,
        balance: recipientUser.balance + amount,
      }

      // Create new transaction
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        amount,
        type: "transfer",
        description: description || "Transfer",
        date: new Date(),
        status: "completed",
        fromUserId: currentUser.id,
        toUserId,
      }

      // Update transactions
      const updatedTransactions = [newTransaction, ...transactions]
      setTransactions(updatedTransactions)

      // Save transactions to local storage
      saveTransactions(currentUser.id, updatedTransactions)

      // Create recipient's transaction
      const recipientTransaction: Transaction = {
        ...newTransaction,
        id: `t${Date.now() + 1}`, // Ensure unique ID
      }

      // Get recipient's transactions
      const storedRecipientTransactions = localStorage.getItem(`cashdapp_transactions_${toUserId}`)
      let recipientTransactions: Transaction[] = []

      if (storedRecipientTransactions) {
        try {
          // Parse transactions and convert date strings back to Date objects
          recipientTransactions = JSON.parse(storedRecipientTransactions, (key, value) => {
            if (key === "date") return new Date(value)
            return value
          })
        } catch (error) {
          console.error("Error parsing recipient transactions:", error)
        }
      }

      // Update recipient's transactions
      const updatedRecipientTransactions = [recipientTransaction, ...recipientTransactions]
      saveTransactions(toUserId, updatedRecipientTransactions)

      // Update users in local storage
      updateUser(updatedSender)
      updateUser(updatedRecipient)

      toast({
        title: "Transfer Successful",
        description: `$${amount.toFixed(2)} has been sent to ${recipientUser.name}`,
      })

      return true
    } catch (error) {
      console.error("Error sending money:", error)
      toast({
        title: "Transfer Failed",
        description: "An error occurred during the transfer",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const requestMoney = async (fromUserId: string, amount: number, description?: string): Promise<boolean> => {
    if (!currentUser) return false

    setIsLoading(true)

    try {
      // Create new transaction
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        amount,
        type: "transfer",
        description: description || "Request",
        date: new Date(),
        status: "pending",
        fromUserId,
        toUserId: currentUser.id,
      }

      // Update transactions
      const updatedTransactions = [newTransaction, ...transactions]
      setTransactions(updatedTransactions)

      // Save transactions to local storage
      saveTransactions(currentUser.id, updatedTransactions)

      // Create a pending transaction for the other user
      const otherUserTransaction: Transaction = {
        ...newTransaction,
        id: `t${Date.now() + 1}`, // Ensure unique ID
        toUserId: currentUser.id,
        fromUserId: fromUserId,
      }

      // Get other user's transactions
      const storedOtherUserTransactions = localStorage.getItem(`cashdapp_transactions_${fromUserId}`)
      let otherUserTransactions: Transaction[] = []

      if (storedOtherUserTransactions) {
        try {
          otherUserTransactions = JSON.parse(storedOtherUserTransactions, (key, value) => {
            if (key === "date") return new Date(value)
            return value
          })
        } catch (error) {
          console.error("Error parsing other user transactions:", error)
        }
      }

      // Update other user's transactions
      const updatedOtherUserTransactions = [otherUserTransaction, ...otherUserTransactions]
      saveTransactions(fromUserId, updatedOtherUserTransactions)

      toast({
        title: "Request Sent",
        description: `Request for $${amount.toFixed(2)} has been sent`,
      })

      return true
    } catch (error) {
      console.error("Error requesting money:", error)
      toast({
        title: "Request Failed",
        description: "An error occurred while sending the request",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const acceptRequest = async (transactionId: string): Promise<boolean> => {
    if (!currentUser) return false

    setIsLoading(true)

    try {
      // Find the request transaction
      const requestTransaction = transactions.find((t) => t.id === transactionId)

      if (!requestTransaction || requestTransaction.status !== "pending") {
        throw new Error("Request not found or already processed")
      }

      // Send money to fulfill the request
      const success = await sendMoney(
        requestTransaction.toUserId!,
        requestTransaction.amount,
        `Payment for: ${requestTransaction.description}`,
      )

      if (!success) {
        throw new Error("Failed to send money")
      }

      // Update the request transaction status
      const updatedTransactions = transactions.map((t) => (t.id === transactionId ? { ...t, status: "completed" } : t))

      setTransactions(updatedTransactions)
      saveTransactions(currentUser.id, updatedTransactions)

      toast({
        title: "Request Accepted",
        description: `You've paid $${requestTransaction.amount.toFixed(2)}`,
      })

      return true
    } catch (error) {
      console.error("Error accepting request:", error)
      toast({
        title: "Failed to Accept Request",
        description: "An error occurred while processing the payment",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const rejectRequest = async (transactionId: string): Promise<boolean> => {
    if (!currentUser) return false

    setIsLoading(true)

    try {
      // Find the request transaction
      const requestTransaction = transactions.find((t) => t.id === transactionId)

      if (!requestTransaction || requestTransaction.status !== "pending") {
        throw new Error("Request not found or already processed")
      }

      // Update the request transaction status
      const updatedTransactions = transactions.map((t) => (t.id === transactionId ? { ...t, status: "failed" } : t))

      setTransactions(updatedTransactions)
      saveTransactions(currentUser.id, updatedTransactions)

      toast({
        title: "Request Rejected",
        description: "The payment request has been rejected",
      })

      return true
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast({
        title: "Failed to Reject Request",
        description: "An error occurred while rejecting the request",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const depositFunds = async (amount: number, source: string): Promise<boolean> => {
    if (!currentUser) return false

    setIsLoading(true)

    try {
      // In a real app, this would call the Stripe API to process the payment
      // For demo purposes, we'll just update the balance directly

      // Update user balance
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance + amount,
      }

      // Create new transaction
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        amount,
        type: "deposit",
        description: `Deposit from ${source}`,
        date: new Date(),
        status: "completed",
      }

      // Update transactions
      const updatedTransactions = [newTransaction, ...transactions]
      setTransactions(updatedTransactions)

      // Save transactions to local storage
      saveTransactions(currentUser.id, updatedTransactions)

      // Update user in local storage
      updateUser(updatedUser)

      toast({
        title: "Deposit Successful",
        description: `$${amount.toFixed(2)} has been added to your account`,
      })

      return true
    } catch (error) {
      console.error("Error depositing funds:", error)
      toast({
        title: "Deposit Failed",
        description: "An error occurred during the deposit",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const withdrawFunds = async (amount: number, destination: string): Promise<boolean> => {
    if (!currentUser) return false

    setIsLoading(true)

    try {
      // Check if user has enough balance
      if (currentUser.balance < amount) {
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough funds to complete this withdrawal",
          variant: "destructive",
        })
        return false
      }

      // Update user balance
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance - amount,
      }

      // Create new transaction
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        amount,
        type: "withdrawal",
        description: `Withdrawal to ${destination}`,
        date: new Date(),
        status: "completed",
      }

      // Update transactions
      const updatedTransactions = [newTransaction, ...transactions]
      setTransactions(updatedTransactions)

      // Save transactions to local storage
      saveTransactions(currentUser.id, updatedTransactions)

      // Update user in local storage
      updateUser(updatedUser)

      toast({
        title: "Withdrawal Successful",
        description: `$${amount.toFixed(2)} has been withdrawn from your account`,
      })

      return true
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      toast({
        title: "Withdrawal Failed",
        description: "An error occurred during the withdrawal",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const addContact = (user: User) => {
    if (!contacts.some((c) => c.id === user.id)) {
      const updatedContacts = [...contacts, user]
      setContacts(updatedContacts)
    }
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated,
        transactions,
        contacts,
        login,
        register,
        logout,
        sendMoney,
        requestMoney,
        depositFunds,
        withdrawFunds,
        addContact,
        acceptRequest,
        rejectRequest,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
