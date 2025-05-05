"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { HardDrive, Usb, MemoryStickIcon as SdCard, RefreshCw, Smartphone, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface DeviceDetectorProps {
  onDeviceDetected: (device: StorageDevice) => void
}

export interface StorageDevice {
  id: string
  name: string
  type: "usb" | "sd" | "phone" | "other"
  capacity: string
  available: string
  lastUsed?: string
  hasColdWallet?: boolean
}

export function DeviceDetector({ onDeviceDetected }: DeviceDetectorProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [availableDevices, setAvailableDevices] = useState<StorageDevice[]>([])
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualDeviceName, setManualDeviceName] = useState("")
  const [previousDevices, setPreviousDevices] = useState<StorageDevice[]>([])
  const { toast } = useToast()

  // Load previously used devices from localStorage
  useEffect(() => {
    const storedDevices = localStorage.getItem("coldwallet-devices")
    if (storedDevices) {
      try {
        const devices = JSON.parse(storedDevices)
        setPreviousDevices(devices)
      } catch (error) {
        console.error("Error loading previous devices:", error)
      }
    }
  }, [])

  // Function to simulate device detection
  // In a real app, this would use the Web USB API or File System Access API
  const scanForDevices = async () => {
    setIsScanning(true)
    setAvailableDevices([])

    try {
      // Simulate device detection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get previously used devices
      const storedDevices = localStorage.getItem("coldwallet-devices")
      let previousDevices: StorageDevice[] = []

      if (storedDevices) {
        try {
          previousDevices = JSON.parse(storedDevices)
        } catch (error) {
          console.error("Error parsing stored devices:", error)
        }
      }

      // Simulate finding devices
      const mockDevices: StorageDevice[] = [
        {
          id: `usb-${Math.random().toString(36).substring(2, 9)}`,
          name: "CashDapp Secure USB",
          type: "usb",
          capacity: "16 GB",
          available: "15.5 GB",
          hasColdWallet: false,
        },
        {
          id: `sd-${Math.random().toString(36).substring(2, 9)}`,
          name: "SanDisk SD Card",
          type: "sd",
          capacity: "32 GB",
          available: "30.2 GB",
          hasColdWallet: false,
        },
        {
          id: `phone-${Math.random().toString(36).substring(2, 9)}`,
          name: "iPhone (via USB)",
          type: "phone",
          capacity: "128 GB",
          available: "64.5 GB",
          hasColdWallet: false,
        },
      ]

      // Add a previously used device to the mock list (if any exist)
      if (previousDevices.length > 0) {
        // Randomly select a previous device to "reconnect"
        const randomPrevDevice = previousDevices[Math.floor(Math.random() * previousDevices.length)]

        // Add it to the mock devices with updated properties
        mockDevices.push({
          ...randomPrevDevice,
          lastUsed: new Date().toISOString(),
          hasColdWallet: true,
        })
      }

      setAvailableDevices(mockDevices)

      toast({
        title: "Devices Found",
        description: `Found ${mockDevices.length} storage devices`,
      })
    } catch (error) {
      console.error("Error scanning for devices:", error)
      toast({
        title: "Scan Failed",
        description: "Failed to detect any storage devices",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleManualDeviceAdd = () => {
    if (!manualDeviceName) {
      toast({
        title: "Device Name Required",
        description: "Please enter a name for your device",
        variant: "destructive",
      })
      return
    }

    const manualDevice: StorageDevice = {
      id: `manual-${Date.now()}`,
      name: manualDeviceName,
      type: "other",
      capacity: "Unknown",
      available: "Unknown",
      hasColdWallet: false,
    }

    // Add to previous devices
    const updatedPreviousDevices = [...previousDevices, manualDevice]
    setPreviousDevices(updatedPreviousDevices)
    localStorage.setItem("coldwallet-devices", JSON.stringify(updatedPreviousDevices))

    onDeviceDetected(manualDevice)
    setManualDeviceName("")
    setShowManualEntry(false)
  }

  const handleDeviceSelect = (device: StorageDevice) => {
    // Update the device's last used timestamp
    const updatedDevice = {
      ...device,
      lastUsed: new Date().toISOString(),
    }

    // Update the list of previous devices
    const updatedPreviousDevices = [...previousDevices]
    const existingIndex = updatedPreviousDevices.findIndex((d) => d.id === device.id)

    if (existingIndex >= 0) {
      updatedPreviousDevices[existingIndex] = updatedDevice
    } else {
      updatedPreviousDevices.push(updatedDevice)
    }

    // Save to localStorage
    localStorage.setItem("coldwallet-devices", JSON.stringify(updatedPreviousDevices))

    // Notify parent component
    onDeviceDetected(updatedDevice)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "usb":
        return <Usb className="h-5 w-5" />
      case "sd":
        return <SdCard className="h-5 w-5" />
      case "phone":
        return <Smartphone className="h-5 w-5" />
      default:
        return <HardDrive className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={scanForDevices}
        disabled={isScanning}
        className="w-full py-2 px-4 bg-primary text-white rounded-md flex items-center justify-center"
      >
        {isScanning ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            <span>Scanning...</span>
            <span className="ml-2 text-xs">(Step 1 of 3)</span>
          </>
        ) : (
          <>
            <HardDrive className="mr-2 h-4 w-4" />
            Scan for Devices
          </>
        )}
      </Button>

      {previousDevices.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium">Previously Used Devices</p>
          {previousDevices.map((device) => (
            <Card
              key={device.id}
              className="cursor-pointer hover:bg-primary/5 transition-colors border-primary/20 shadow-sm"
              onClick={() => handleDeviceSelect(device)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{device.name}</p>
                      {device.hasColdWallet && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          <Database className="h-3 w-3 mr-1" />
                          Cold Wallet
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">
                      {device.capacity} • {device.available} available
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{
                          width: `${Math.round((1 - Number.parseFloat(device.available) / Number.parseFloat(device.capacity)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Step 2: Select this device</div>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {availableDevices.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Available Devices</p>
          {availableDevices.map((device) => (
            <Card
              key={device.id}
              className="cursor-pointer hover:bg-primary/5 transition-colors border-primary/20 shadow-sm"
              onClick={() => handleDeviceSelect(device)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{device.name}</p>
                      {device.hasColdWallet && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          <Database className="h-3 w-3 mr-1" />
                          Cold Wallet
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">
                      {device.capacity} • {device.available} available
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{
                          width: `${Math.round((1 - Number.parseFloat(device.available) / Number.parseFloat(device.capacity)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Step 2: Select this device</div>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!showManualEntry ? (
        <Button variant="outline" className="w-full" onClick={() => setShowManualEntry(true)}>
          Add Device Manually
        </Button>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                id="device-name"
                placeholder="Enter device name"
                value={manualDeviceName}
                onChange={(e) => setManualDeviceName(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowManualEntry(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleManualDeviceAdd}>
                Add Device
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground text-center">
        Connect a USB drive, SD card, or other storage device to store your Cash offline
      </p>
    </div>
  )
}
