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

interface SupplierPricingClientProps {
    dict: any;
}

export default function SupplierPricingClient({ dict }: SupplierPricingClientProps) {
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
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.supplier.pricingPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.supplier.pricingPage.description}</p>
            </div>

            {/* Live Gold Price Card */}
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{dict.marketplace.supplier.pricingPage.liveGoldPrice}</span>
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
                        <span className="text-base font-normal text-muted-foreground ml-2">{dict.marketplace.supplier.pricingPage.perGram}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {dict.marketplace.supplier.pricingPage.lastUpdated} {config.lastUpdated}
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Pricing Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>{dict.marketplace.supplier.pricingPage.configuration.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{dict.marketplace.supplier.pricingPage.configuration.automaticPricing}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {dict.marketplace.supplier.pricingPage.configuration.automaticPricingDesc}
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
                            <Label htmlFor="markup">{dict.marketplace.supplier.pricingPage.configuration.markupPercentage}</Label>
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
                                {dict.marketplace.supplier.pricingPage.configuration.markupDesc}
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{dict.marketplace.supplier.pricingPage.configuration.status}</span>
                                <Badge
                                    variant="default"
                                    className={config.automaticPricing ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                                >
                                    {config.automaticPricing ? dict.marketplace.supplier.pricingPage.configuration.automatic : dict.marketplace.supplier.pricingPage.configuration.manualOverride}
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
                            {dict.marketplace.supplier.pricingPage.calculator.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="calc-weight">{dict.marketplace.supplier.pricingPage.calculator.weight}</Label>
                            <Input
                                id="calc-weight"
                                type="number"
                                value={calculatorWeight}
                                onChange={(e) => setCalculatorWeight(parseFloat(e.target.value) || 0)}
                                step="0.1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="calc-karat">{dict.marketplace.supplier.pricingPage.calculator.karat}</Label>
                            <Select value={calculatorKarat} onValueChange={(value: '18K' | '22K' | '24K') => setCalculatorKarat(value)}>
                                <SelectTrigger id="calc-karat">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="18K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['18k']}</SelectItem>
                                    <SelectItem value="22K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['22k']}</SelectItem>
                                    <SelectItem value="24K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['24k']}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 border-t space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{dict.marketplace.supplier.pricingPage.calculator.spotValue}</span>
                                <span className="font-medium">${calculatorBaseCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{dict.marketplace.supplier.pricingPage.calculator.markup} ({config.markupPercentage}%):</span>
                                <span className="font-medium">${calculatorMarkup.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>{dict.marketplace.supplier.pricingPage.calculator.finalPrice}</span>
                                <span className="text-green-600">${calculatorFinalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Product Price Summary Table */}
            <Card>
                <CardHeader>
                    <CardTitle>{dict.marketplace.supplier.pricingPage.summary.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.product}</TableHead>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.karat}</TableHead>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.weight}</TableHead>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.baseCost}</TableHead>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.markup}</TableHead>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.finalPrice}</TableHead>
                                <TableHead>{dict.marketplace.supplier.pricingPage.summary.table.mode}</TableHead>
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
                                                {config.automaticPricing ? dict.marketplace.supplier.pricingPage.summary.auto : dict.marketplace.supplier.pricingPage.summary.manual}
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
