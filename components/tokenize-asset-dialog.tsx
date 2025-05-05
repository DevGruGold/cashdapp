"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface TokenizeAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetType: "property" | "vehicle" | "document" | "valuable"
}

export function TokenizeAssetDialog({ open, onOpenChange, assetType }: TokenizeAssetDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [type, setType] = useState(assetType)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleTokenize = async () => {
    if (!name || !value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Asset Tokenized",
        description: "Your asset has been successfully tokenized",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Tokenization Failed",
        description: "There was an error tokenizing your asset",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAssetTypeLabel = () => {
    switch (type) {
      case "property":
        return "Property"
      case "vehicle":
        return "Vehicle"
      case "document":
        return "Document"
      case "valuable":
        return "Valuable"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tokenize Asset</DialogTitle>
          <DialogDescription>Convert your physical assets into digital tokens on the blockchain.</DialogDescription>
        </DialogHeader>

        {/* Add progress indicator */}
        <div className="w-full bg-muted h-2 rounded-full mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: isLoading ? "90%" : "30%" }}
          ></div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="asset-type">Asset Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="asset-type">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="valuable">Valuable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asset-name">Asset Name</Label>
            <Input
              id="asset-name"
              placeholder={`Enter ${getAssetTypeLabel().toLowerCase()} name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asset-description">Description</Label>
            <Textarea
              id="asset-description"
              placeholder={`Describe your ${getAssetTypeLabel().toLowerCase()}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asset-value">Estimated Value (USD)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
              <Input
                id="asset-value"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asset-documents">Upload Documents</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Upload proof of ownership, photos, or other relevant documents
              </p>
              <Input id="asset-documents" type="file" className="hidden" multiple />
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleTokenize} disabled={!name || !value || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tokenizing...
              </>
            ) : (
              "Tokenize Asset"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
