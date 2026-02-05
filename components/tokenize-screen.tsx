"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useLanguage } from "./language-provider"
import { ethers } from "ethers"

// Simple ABI for the RealEstateToken contract (tokenizeProperty function)
const CONTRACT_ABI = [
  "function tokenizeProperty(address to, string memory tokenURI, string memory _location, uint256 _valuation, uint256 _sqft, string memory _documentHash) public returns (uint256)"
];
const CONTRACT_ADDRESS = "0x..."; // Replace with deployed address

export function TokenizeScreen() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [type, setType] = useState<string>("property")

  // Real Estate Specific Fields
  const [location, setLocation] = useState("")
  const [sqft, setSqft] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  const handleTokenize = async () => {
    if (!name || !value) {
      toast({
        title: t("common.error"),
        description: t("assets.missingFields"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (type === 'property' && window.ethereum) {
        // Smart Contract Interaction for Property
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Mock IPFS hash/URI for now
        const docHash = "QmHash...";
        const tokenURI = "ipfs://QmMetadata...";

        const tx = await contract.tokenizeProperty(
          await signer.getAddress(),
          tokenURI,
          location,
          ethers.utils.parseEther(value),
          sqft || 0,
          docHash
        );
        await tx.wait();
        toast({
          title: "On-Chain Success",
          description: "Property Tokenized on Blockchain!",
        })
      } else {
        // Simulate API call for other types
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast({
          title: t("assets.tokenizeSuccess"),
          description: t("assets.tokenizeSuccessDesc"),
        })
      }

      router.push("/banking?tab=assets")
    } catch (error) {
      console.error(error);
      toast({
        title: t("assets.tokenizeFailed"),
        description: error.message || t("assets.tokenizeFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAssetTypeLabel = () => {
    switch (type) {
      case "property":
        return t("assets.property")
      case "vehicle":
        return t("assets.vehicle")
      case "document":
        return t("assets.document")
      case "valuable":
        return t("assets.valuable")
      default:
        return t("assets.asset")
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">{t("assets.tokenize")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("assets.tokenizeAsset")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress indicator */}
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: isLoading ? "90%" : "30%" }}
            ></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-type">{t("assets.assetType")}</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger id="asset-type">
                  <SelectValue placeholder={t("assets.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">{t("assets.property")}</SelectItem>
                  <SelectItem value="vehicle">{t("assets.vehicle")}</SelectItem>
                  <SelectItem value="document">{t("assets.document")}</SelectItem>
                  <SelectItem value="valuable">{t("assets.valuable")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'property' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="asset-location">Property Location</Label>
                  <Input
                    id="asset-location"
                    placeholder="123 Blockchain Blvd"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-sqft">Square Footage</Label>
                  <Input
                    id="asset-sqft"
                    type="number"
                    placeholder="2500"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="asset-name">{t("assets.assetName")}</Label>
              <Input
                id="asset-name"
                placeholder={`${t("assets.enter")} ${getAssetTypeLabel()?.toLowerCase() || t("assets.asset")} ${t("assets.name")}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-description">{t("assets.description")}</Label>
              <Textarea
                id="asset-description"
                placeholder={`${t("assets.describe")} ${getAssetTypeLabel()?.toLowerCase() || t("assets.asset")}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-value">{t("assets.estimatedValue")}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="asset-documents">{t("assets.uploadDocuments")}</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">{t("assets.dragAndDrop")}</p>
                <p className="text-xs text-muted-foreground">{t("assets.uploadProof")}</p>
                <Input id="asset-documents" type="file" className="hidden" multiple />
                <Button variant="outline" size="sm" className="mt-4">
                  {t("assets.browseFiles")}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleTokenize} disabled={!name || !value || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("assets.tokenizing")}
                </>
              ) : (
                t("assets.tokenize")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
