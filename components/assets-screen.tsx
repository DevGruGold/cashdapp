"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenizeAssetDialog } from "@/components/tokenize-asset-dialog"
import { useLanguage } from "./language-provider"

export function AssetsScreen() {
  const [showTokenizeDialog, setShowTokenizeDialog] = useState(false)
  const { t } = useLanguage()

  // Mock assets data
  const assets = [
    {
      id: "1",
      name: "Real Estate Token",
      description: "Tokenized property at 123 Main St",
      value: 250000,
      tokenId: "PROP123",
    },
    {
      id: "2",
      name: "Vehicle Token",
      description: "2023 Tesla Model Y",
      value: 45000,
      tokenId: "VEH456",
    },
    {
      id: "3",
      name: "Art Collection",
      description: "Digital art collection by Artist Name",
      value: 15000,
      tokenId: "ART789",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("assets.title")}</h1>
        <Button onClick={() => setShowTokenizeDialog(true)}>{t("assets.tokenize")}</Button>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>{asset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Token ID: {asset.tokenId}</span>
                <span className="font-medium">${asset.value.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Transfer
              </Button>
            </CardFooter>
          </Card>
        ))}

        {assets.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No tokenized assets found. Click "Tokenize Asset" to get started.
            </CardContent>
          </Card>
        )}
      </div>

      {showTokenizeDialog && <TokenizeAssetDialog open={showTokenizeDialog} onOpenChange={setShowTokenizeDialog} />}
    </div>
  )
}
