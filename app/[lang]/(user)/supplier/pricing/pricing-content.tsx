'use client';

import { useState } from 'react';
import { Product } from '@/lib/mock-data';
import { PricingConfig } from './pricing-config';
import { PriceCalculator } from './price-calculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface PricingContentProps {
    dict: any;
    products: Product[];
    initialConfig: {
        spotPricePerGram: number;
        markupPercentage: number;
        automaticPricing: boolean;
    };
}

export function PricingContent({ dict, products, initialConfig }: PricingContentProps) {
    const [config, setConfig] = useState(initialConfig);

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

    const handleConfigChange = (newConfig: { automaticPricing: boolean; markupPercentage: number }) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                <PricingConfig
                    dict={dict}
                    initialAutomaticPricing={config.automaticPricing}
                    initialMarkupPercentage={config.markupPercentage}
                    onConfigChange={handleConfigChange}
                />
                <PriceCalculator
                    dict={dict}
                    spotPricePerGram={config.spotPricePerGram}
                    markupPercentage={config.markupPercentage}
                />
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
                            {products.map((product) => {
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
        </>
    );
}
