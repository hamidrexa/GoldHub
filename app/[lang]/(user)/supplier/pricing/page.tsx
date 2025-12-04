'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { mockPricingConfig, mockProducts, Product } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function SupplierPricingPage() {
    const [config, setConfig] = useState(mockPricingConfig);
    const [calculatorWeight, setCalculatorWeight] = useState<number>(50);
    const [calculatorKarat, setCalculatorKarat] = useState<'18K' | '22K' | '24K'>('24K');

    const goldPriceChange = 1.2; // Mock 24h change

    // Calculate karat purity multiplier
    const getKaratMultiplier = (karat: string) => {
        switch (karat) {
            case '24K': return 1.0;
            case '22K': return 0.916;
            case '18K': return 0.75;
            default: return 1.0;
        }
    };

    // Calculate product pricing
    const calculateProductPrice = (product: Product) => {
        const baseCost = product.weight * config.spotPricePerGram * getKaratMultiplier(product.karat);
        const markup = baseCost * (config.markupPercentage / 100);
        const finalPrice = baseCost + markup;
        return { baseCost, markup, finalPrice };
    };

    // Calculator calculations
    const calculatorBaseCost = calculatorWeight * config.spotPricePerGram * getKaratMultiplier(calculatorKarat);
    const calculatorMarkup = calculatorBaseCost * (config.markupPercentage / 100);
    const calculatorFinalPrice = calculatorBaseCost + calculatorMarkup;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
                <p className="text-muted-foreground">Manage your pricing configuration and calculator</p>
            </div>

            {/* Live Gold Price Card */}
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Live Gold Price</span>
                        {goldPriceChange >= 0 ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{goldPriceChange}%
                            </Badge>
                        ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {goldPriceChange}%
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-yellow-700">
                        ${config.spotPricePerGram.toFixed(2)}
                        <span className="text-base font-normal text-muted-foreground ml-2">/ gram</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Last updated: {config.lastUpdated}
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Pricing Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Automatic Pricing</Label>
                                <p className="text-sm text-muted-foreground">
                                    Update prices based on spot price
                                </p>
                            </div>
                            <Switch
                                checked={config.automaticPricing}
                                onCheckedChange={(checked) =>
                                    setConfig({ ...config, automaticPricing: checked })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="markup">Markup Percentage (%)</Label>
                            <Input
                                id="markup"
                                type="number"
                                value={config.markupPercentage}
                                onChange={(e) =>
                                    setConfig({ ...config, markupPercentage: parseFloat(e.target.value) || 0 })
                                }
                                step="0.1"
                            />
                            <p className="text-xs text-muted-foreground">
                                Applied to all products with automatic pricing
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge
                                    variant="default"
                                    className={config.automaticPricing ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                                >
                                    {config.automaticPricing ? 'Automatic' : 'Manual Override'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Price Calculator */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Price Calculator
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="calc-weight">Weight (grams)</Label>
                            <Input
                                id="calc-weight"
                                type="number"
                                value={calculatorWeight}
                                onChange={(e) => setCalculatorWeight(parseFloat(e.target.value) || 0)}
                                step="0.1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="calc-karat">Karat</Label>
                            <Select value={calculatorKarat} onValueChange={(value: '18K' | '22K' | '24K') => setCalculatorKarat(value)}>
                                <SelectTrigger id="calc-karat">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="18K">18K (75% pure)</SelectItem>
                                    <SelectItem value="22K">22K (91.6% pure)</SelectItem>
                                    <SelectItem value="24K">24K (100% pure)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 border-t space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Spot Value:</span>
                                <span className="font-medium">${calculatorBaseCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Markup ({config.markupPercentage}%):</span>
                                <span className="font-medium">${calculatorMarkup.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Final Price:</span>
                                <span className="text-green-600">${calculatorFinalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Product Price Summary Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Price Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Karat</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Base Cost</TableHead>
                                <TableHead>Markup</TableHead>
                                <TableHead>Final Price</TableHead>
                                <TableHead>Mode</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockProducts.filter(p => p.status === 'active').map((product) => {
                                const { baseCost, markup, finalPrice } = calculateProductPrice(product);
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.karat}</TableCell>
                                        <TableCell>{product.weight}g</TableCell>
                                        <TableCell>${baseCost.toFixed(2)}</TableCell>
                                        <TableCell>${markup.toFixed(2)}</TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            ${finalPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="default"
                                                className={config.automaticPricing ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                                            >
                                                {config.automaticPricing ? 'Auto' : 'Manual'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
