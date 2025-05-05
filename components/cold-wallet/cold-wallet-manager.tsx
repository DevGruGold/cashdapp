"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Save,
  Download,
  HardDrive,
  Trash,
  Wallet,
  AlertCircle,
  Check,
  RefreshCw,
  FileText,
  Lock,
  History,
  Database,
  Shield,
  Send,
  UserCircle,
  Activity,
  Coins,
  Settings,
  BanknoteIcon as Bank,
  Terminal,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeviceDetector, type StorageDevice } from "@/components/cold-wallet/device-detector"
import { useUser } from "@/components/user-provider"
import { formatCurrency } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/components/wallet-provider"
import { TransactionHistory, type ColdWalletTransaction } from "@/components/cold-wallet/transaction-history"
import { Badge } from "@/components/ui/badge"
import { OfflineTransfer } from "@/components/cold-wallet/offline-transfer"
import { PendingTransfers } from "@/components/cold-wallet/pending-transfers"

interface ColdWalletManagerProps {
  onBack: () => void
  balance?: string
}

interface ColdWalletData {
  balance: string
  encrypted: boolean
  transactions: ColdWalletTransaction[]
  lastUpdated: string
  version: string
}

export function ColdWalletManager({ onBack, balance }: ColdWalletManagerProps) {
  const [device, setDevice] = useState<StorageDevice | null>(null)
  const [amount, setAmount] = useState("")
  const [coldWalletBalance, setColdWalletBalance] = useState("0.00")
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null)
  const [status, setStatus] = useState<"idle" | "success" | "error" | "processing">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("devices")
  const [password, setPassword] = useState("")
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [showBackupOptions, setShowBackupOptions] = useState(false)
  const [transactions, setTransactions] = useState<ColdWalletTransaction[]>([])
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const { toast } = useToast()
  const { isAuthenticated, currentUser, depositFunds, withdrawFunds } = useUser()
  const { isConnected, connect } = useWallet()

  // Load cold wallet data from local storage when device changes
  useEffect(() => {
    if (device) {
      loadColdWalletData(device.id)
    }
  }, [device])

  const loadColdWalletData = (deviceId: string) => {
    const storedData = localStorage.getItem(`coldwallet-${deviceId}`)

    if (storedData) {
      try {
        const data: ColdWalletData = JSON.parse(storedData)
        setColdWalletBalance(data.balance)
        setIsEncrypted(data.encrypted)
        setTransactions(data.transactions || [])
        setLastSynced(data.lastUpdated)

        // Update device in the list of previous devices
        updateDeviceInStorage(deviceId, true)
      } catch (error) {
        console.error("Error parsing cold wallet data:", error)
        initializeNewColdWallet(deviceId)
      }
    } else {
      initializeNewColdWallet(deviceId)
    }
  }

  const initializeNewColdWallet = (deviceId: string) => {
    const newWalletData: ColdWalletData = {
      balance: "0.00",
      encrypted: false,
      transactions: [],
      lastUpdated: new Date().toISOString(),
      version: "1.0",
    }

    setColdWalletBalance("0.00")
    setIsEncrypted(false)
    setTransactions([])
    setLastSynced(newWalletData.lastUpdated)

    // Save to localStorage
    localStorage.setItem(`coldwallet-${deviceId}`, JSON.stringify(newWalletData))

    // Update device in the list of previous devices
    updateDeviceInStorage(deviceId, true)
  }

  const updateDeviceInStorage = (deviceId: string, hasColdWallet: boolean) => {
    const storedDevices = localStorage.getItem("coldwallet-devices")

    if (storedDevices) {
      try {
        const devices: StorageDevice[] = JSON.parse(storedDevices)
        const updatedDevices = devices.map((d) =>
          d.id === deviceId ? { ...d, hasColdWallet, lastUsed: new Date().toISOString() } : d,
        )

        localStorage.setItem("coldwallet-devices", JSON.stringify(updatedDevices))
      } catch (error) {
        console.error("Error updating device in storage:", error)
      }
    }
  }

  const saveColdWalletData = (deviceId: string, balance: string, newTransaction?: ColdWalletTransaction) => {
    const storedData = localStorage.getItem(`coldwallet-${deviceId}`)
    let data: ColdWalletData

    if (storedData) {
      try {
        data = JSON.parse(storedData)
      } catch (error) {
        console.error("Error parsing cold wallet data:", error)
        data = {
          balance: "0.00",
          encrypted: isEncrypted,
          transactions: [],
          lastUpdated: new Date().toISOString(),
          version: "1.0",
        }
      }
    } else {
      data = {
        balance: "0.00",
        encrypted: isEncrypted,
        transactions: [],
        lastUpdated: new Date().toISOString(),
        version: "1.0",
      }
    }

    // Update data
    data.balance = balance
    data.encrypted = isEncrypted
    data.lastUpdated = new Date().toISOString()

    // Add new transaction if provided
    if (newTransaction) {
      data.transactions = [newTransaction, ...(data.transactions || [])]
    }

    // Save to localStorage
    localStorage.setItem(`coldwallet-${deviceId}`, JSON.stringify(data))

    // Update state
    setColdWalletBalance(balance)
    setLastSynced(data.lastUpdated)
    if (newTransaction) {
      setTransactions([newTransaction, ...transactions])
    }
  }

  const handleDeviceDetected = (detectedDevice: StorageDevice) => {
    setDevice(detectedDevice)
    setStatus("idle")
    setErrorMessage("")

    toast({
      title: "Device Connected",
      description: `Connected to ${detectedDevice.name}`,
    })
  }

  const simulateTransferProgress = async () => {
    setProgress(0)
    setStatus("processing")

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  const handleDeposit = async () => {
    if (!device) {
      setErrorMessage("Please connect a storage device first")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount")
      return
    }

    if (currentUser && Number.parseFloat(amount) > currentUser.balance) {
      setErrorMessage("Insufficient funds in your account")
      return
    }

    if (isEncrypted && !password) {
      setErrorMessage("Please enter your encryption password")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      // Simulate transfer progress
      await simulateTransferProgress()

      // First withdraw from user account
      const withdrawSuccess = await withdrawFunds(Number.parseFloat(amount), "Cold Storage")

      if (!withdrawSuccess) {
        throw new Error("Failed to withdraw funds from your account")
      }

      // Update cold wallet balance
      const newColdWalletBalance = (Number.parseFloat(coldWalletBalance) + Number.parseFloat(amount)).toFixed(2)

      // Create transaction record
      const newTransaction: ColdWalletTransaction = {
        id: `tx-${Date.now()}`,
        type: "deposit",
        amount: Number.parseFloat(amount),
        date: new Date().toISOString(),
        status: "completed",
        description: "Transferred to cold storage",
      }

      // Save to device (localStorage)
      saveColdWalletData(device.id, newColdWalletBalance, newTransaction)

      setStatus("success")
      toast({
        title: "Deposit Successful",
        description: `$${amount} has been transferred to your Cold Wallet`,
      })

      // Reset form after success
      setAmount("")
      setAction(null)
      setPassword("")
    } catch (error) {
      console.error("Error depositing to cold wallet:", error)
      setStatus("error")
      setErrorMessage("Failed to transfer funds to your Cold Wallet")

      toast({
        title: "Deposit Failed",
        description: "Failed to transfer funds to your Cold Wallet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!device) {
      setErrorMessage("Please connect a storage device first")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(coldWalletBalance)) {
      setErrorMessage("Insufficient funds in your Cold Wallet")
      return
    }

    if (isEncrypted && !password) {
      setErrorMessage("Please enter your encryption password")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      // Simulate transfer progress
      await simulateTransferProgress()

      // First update cold wallet balance
      const newColdWalletBalance = (Number.parseFloat(coldWalletBalance) - Number.parseFloat(amount)).toFixed(2)

      // Then deposit to user account
      const depositSuccess = await depositFunds(Number.parseFloat(amount), "Cold Storage")

      if (!depositSuccess) {
        throw new Error("Failed to deposit funds to your account")
      }

      // Create transaction record
      const newTransaction: ColdWalletTransaction = {
        id: `tx-${Date.now()}`,
        type: "withdraw",
        amount: Number.parseFloat(amount),
        date: new Date().toISOString(),
        status: "completed",
        description: "Withdrawn from cold storage",
      }

      // Save to device (localStorage)
      saveColdWalletData(device.id, newColdWalletBalance, newTransaction)

      setStatus("success")
      toast({
        title: "Withdrawal Successful",
        description: `$${amount} has been transferred from your Cold Wallet`,
      })

      // Reset form after success
      setAmount("")
      setAction(null)
      setPassword("")
    } catch (error) {
      console.error("Error withdrawing from cold wallet:", error)
      setStatus("error")
      setErrorMessage("Failed to transfer funds from your Cold Wallet")

      toast({
        title: "Withdrawal Failed",
        description: "Failed to transfer funds from your Cold Wallet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEject = () => {
    if (device) {
      toast({
        title: "Device Ejected",
        description: "You can now safely remove your storage device",
      })
    }

    setDevice(null)
    setColdWalletBalance("0.00")
    setAction(null)
    setStatus("idle")
    setErrorMessage("")
    setPassword("")
    setIsEncrypted(false)
    setTransactions([])
    setLastSynced(null)
  }

  const handleToggleEncryption = () => {
    if (!device) return

    if (!isEncrypted && !password) {
      setErrorMessage("Please enter a password to encrypt your wallet")
      return
    }

    const newEncryptionState = !isEncrypted
    setIsEncrypted(newEncryptionState)

    // Save updated encryption state
    saveColdWalletData(device.id, coldWalletBalance)

    toast({
      title: newEncryptionState ? "Wallet Encrypted" : "Wallet Decrypted",
      description: newEncryptionState
        ? "Your cold wallet is now encrypted with a password"
        : "Your cold wallet is no longer encrypted",
    })
  }

  const handleBackup = async () => {
    if (!device) {
      setErrorMessage("Please connect a storage device first")
      return
    }

    setLoading(true)
    setStatus("processing")
    setProgress(0)

    try {
      // Simulate backup process
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Create a backup file (in a real app, this would create an actual file)
      const backupData = {
        coldWalletData: {
          balance: coldWalletBalance,
          encrypted: isEncrypted,
          transactions: transactions,
          lastUpdated: new Date().toISOString(),
          version: "1.0",
        },
        deviceInfo: device,
        backupDate: new Date().toISOString(),
      }

      // In a real app, this would download a file
      console.log("Backup data:", backupData)

      setStatus("success")
      toast({
        title: "Backup Successful",
        description: "Your cold wallet has been backed up successfully",
      })

      setShowBackupOptions(false)
    } catch (error) {
      setStatus("error")
      setErrorMessage("Failed to backup your cold wallet")

      toast({
        title: "Backup Failed",
        description: "Failed to backup your cold wallet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOfflineTransferComplete = (transaction: ColdWalletTransaction) => {
    // Update cold wallet balance if it's a withdrawal
    if (transaction.type === "withdraw" && device) {
      const newBalance = (Number.parseFloat(coldWalletBalance) - transaction.amount).toFixed(2)
      saveColdWalletData(device.id, newBalance, transaction)
    } else if (transaction.type === "deposit" && device) {
      // For incoming transfers
      const newBalance = (Number.parseFloat(coldWalletBalance) + transaction.amount).toFixed(2)
      saveColdWalletData(device.id, newBalance, transaction)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" className="w-fit p-0" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banking
        </Button>

        {device && (
          <Button variant="outline" size="sm" onClick={handleEject}>
            <Trash className="h-4 w-4 mr-1" />
            Eject Device
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cold Wallet</CardTitle>
          <CardDescription>Store your Cash offline on a physical storage device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAuthenticated && (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm mb-2">For the best experience with Cold Wallet features, connect your wallet.</p>
              <Button size="sm" className="w-full" onClick={connect}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="devices" className="flex flex-col items-center py-2 h-auto">
                <HardDrive className="h-4 w-4 mb-1" />
                <span className="text-xs">Devices</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex flex-col items-center py-2 h-auto">
                <History className="h-4 w-4 mb-1" />
                <span className="text-xs">History</span>
              </TabsTrigger>
              <TabsTrigger value="transfers" className="flex flex-col items-center py-2 h-auto">
                <Send className="h-4 w-4 mb-1" />
                <span className="text-xs">Transfers</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex flex-col items-center py-2 h-auto">
                <Shield className="h-4 w-4 mb-1" />
                <span className="text-xs">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="devices">
              {!device ? (
                <DeviceDetector onDeviceDetected={handleDeviceDetected} />
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <HardDrive className="h-8 w-8 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {device.type.toUpperCase()} • {device.capacity}
                          {isEncrypted && <span className="ml-2 text-green-500">• Encrypted</span>}
                        </p>
                        {lastSynced && (
                          <p className="text-xs text-muted-foreground">
                            Last synced: {new Date(lastSynced).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleEject}>
                      <Trash className="h-4 w-4 mr-1" />
                      Eject
                    </Button>
                  </div>

                  <div className="text-center space-y-1 my-4">
                    <p className="text-sm text-muted-foreground">Cold Wallet Balance</p>
                    <p className="text-3xl font-bold">${coldWalletBalance}</p>
                    <Badge variant="outline" className="bg-primary/10">
                      <Database className="h-3 w-3 mr-1" />
                      Offline Storage
                    </Badge>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-3 rounded-md flex items-start mb-4">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  {status === "success" && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 rounded-md flex items-start mb-4">
                      <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p>
                        {action === "deposit"
                          ? "Funds successfully moved to cold storage"
                          : "Funds successfully recovered from cold storage"}
                      </p>
                    </div>
                  )}

                  {status === "processing" && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-md mb-4">
                      <div className="flex items-start mb-2">
                        <RefreshCw className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 animate-spin" />
                        <p>Processing your transaction...</p>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs mt-1 text-right">{progress}%</p>
                    </div>
                  )}

                  {action ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (USD)</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-muted-foreground">$</span>
                          </div>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {isEncrypted && (
                        <div className="space-y-2">
                          <Label htmlFor="password">Encryption Password</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              className="pl-10"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {currentUser && action === "deposit" && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium">Available in Account</p>
                          <p className="text-lg font-bold">{formatCurrency(currentUser.balance)}</p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1" onClick={() => setAction(null)} disabled={loading}>
                          Cancel
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={action === "deposit" ? handleDeposit : handleWithdraw}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : action === "deposit" ? (
                            "Deposit"
                          ) : (
                            "Withdraw"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Button
                          variant="outline"
                          className="flex items-center justify-center space-x-2 py-6"
                          onClick={() => {
                            setAction("deposit")
                            setStatus("idle")
                            setErrorMessage("")
                          }}
                        >
                          <Save className="h-5 w-5" />
                          <span>Deposit to Device</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center space-x-2 py-6"
                          onClick={() => {
                            setAction("withdraw")
                            setStatus("idle")
                            setErrorMessage("")
                          }}
                        >
                          <Download className="h-5 w-5" />
                          <span>Withdraw from Device</span>
                        </Button>
                      </div>

                      <Button variant="secondary" className="w-full" onClick={() => setShowBackupOptions(true)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Backup Cold Wallet
                      </Button>

                      {showBackupOptions && (
                        <div className="mt-4 p-4 border rounded-lg space-y-4">
                          <h3 className="font-medium">Backup Options</h3>
                          <p className="text-sm text-muted-foreground">
                            Create a backup of your cold wallet to protect against device failure or loss.
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={handleBackup} disabled={loading}>
                              Backup to File
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleBackup} disabled={loading}>
                              Backup to Cloud
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowBackupOptions(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="transactions">
              {!device ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Device Connected</h3>
                  <p className="text-muted-foreground mb-4">Connect a storage device to view transaction history</p>
                  <Button onClick={() => setActiveTab("devices")}>Connect Device</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Transaction History</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View all transactions for this cold wallet device
                  </p>

                  <TransactionHistory transactions={transactions} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="transfers">
              {!device ? (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Device Connected</h3>
                  <p className="text-muted-foreground mb-4">Connect a storage device to manage offline transfers</p>
                  <Button onClick={() => setActiveTab("devices")}>Connect Device</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pending transfers section */}
                  <PendingTransfers deviceId={device.id} onTransferComplete={handleOfflineTransferComplete} />

                  {/* Divider */}
                  <div className="border-t pt-6"></div>

                  {/* Offline transfer section */}
                  <OfflineTransfer
                    device={device}
                    coldWalletBalance={coldWalletBalance}
                    onTransferComplete={handleOfflineTransferComplete}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="security">
              {!device ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Device Connected</h3>
                  <p className="text-muted-foreground mb-4">Connect a storage device to manage security settings</p>
                  <Button onClick={() => setActiveTab("devices")}>Connect Device</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Encryption</h3>
                        <p className="text-sm text-muted-foreground">Encrypt your cold wallet with a password</p>
                      </div>
                      <Button
                        variant={isEncrypted ? "destructive" : "default"}
                        size="sm"
                        onClick={handleToggleEncryption}
                      >
                        {isEncrypted ? "Disable" : "Enable"}
                      </Button>
                    </div>

                    {!isEncrypted && (
                      <div className="space-y-2">
                        <Label htmlFor="encryption-password">Encryption Password</Label>
                        <Input
                          id="encryption-password"
                          type="password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          This password will be required to access your funds
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Recovery Options</h3>
                        <p className="text-sm text-muted-foreground">Set up recovery options for your cold wallet</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => {
                          toast({
                            title: "Recovery Phrase Generated",
                            description: "Your recovery phrase has been generated successfully",
                          })
                        }}
                      >
                        <span>Generate Recovery Phrase</span>
                        <FileText className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "This feature will be available in a future update",
                          })
                        }}
                      >
                        <span>Set Recovery Email</span>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-muted-foreground border-t p-4">
          <p className="mb-2 font-medium">What is a Cold Wallet?</p>
          <p>
            A Cold Wallet allows you to store your Cash offline on a physical storage device like a USB drive or SD
            card. This provides an extra layer of security and privacy for your funds.
          </p>
        </CardFooter>
      </Card>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 grid grid-cols-6 bg-background border-t">
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <UserCircle className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Activity className="h-5 w-5" />
          <span className="text-xs">Activity</span>
        </button>
        <button className="flex flex-col items-center justify-center text-primary">
          <Bank className="h-5 w-5" />
          <span className="text-xs">Banking</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Terminal className="h-5 w-5" />
          <span className="text-xs">Terminal</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Coins className="h-5 w-5" />
          <span className="text-xs">Assets</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  )
}
