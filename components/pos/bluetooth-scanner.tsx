"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface BluetoothScannerProps {
  onDeviceDetected: (device: BluetoothDevice) => void
}

export interface BluetoothDevice {
  id: string
  name: string
  type: "pos" | "card-reader" | "printer" | "other"
  connected: boolean
}

export function BluetoothScanner({ onDeviceDetected }: BluetoothScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  // Function to simulate Bluetooth device detection
  // In a real app, this would use the Web Bluetooth API
  const scanForDevices = async () => {
    setIsScanning(true)

    try {
      // Simulate device detection delay
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Simulate finding devices
      const mockDevices: BluetoothDevice[] = [
        {
          id: `pos-${Math.random().toString(36).substring(2, 9)}`,
          name: "Square Terminal",
          type: "pos",
          connected: false,
        },
        {
          id: `reader-${Math.random().toString(36).substring(2, 9)}`,
          name: "Card Reader",
          type: "card-reader",
          connected: false,
        },
      ]

      // Select a random device
      const selectedDevice = mockDevices[Math.floor(Math.random() * mockDevices.length)]

      onDeviceDetected(selectedDevice)

      toast({
        title: "Device Found",
        description: `Found ${selectedDevice.name}`,
      })
    } catch (error) {
      console.error("Error scanning for Bluetooth devices:", error)
      toast({
        title: "Scan Failed",
        description: "Failed to detect any Bluetooth devices",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
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
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Scanning...
          </>
        ) : (
          "Scan for Bluetooth Devices"
        )}
      </Button>
      <p className="text-sm text-muted-foreground text-center">
        Make sure your POS terminal or card reader is in pairing mode
      </p>
    </div>
  )
}
