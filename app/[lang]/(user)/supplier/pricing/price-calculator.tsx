'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PriceCalculatorProps {
    dict: any;
    spotPricePerGram: number;
    markupPercentage: number;
}

export function PriceCalculator({ dict, spotPricePerGram, markupPercentage }: PriceCalculatorProps) {
    const [calculatorWeight, setCalculatorWeight] = useState(50);
    const [calculatorKarat, setCalculatorKarat] = useState<'18K' | '22K' | '24K'>('24K');

    // Calculate karat purity multiplier
    const getKaratMultiplier = (karat: string) => {
        switch (karat) {
            case '24K': return 1.0;
            case '22K': return 0.916;
            case '18K': return 0.75;
            default: return 1.0;
        }
    };

    const calculatorBaseCost = calculatorWeight * spotPricePerGram * getKaratMultiplier(calculatorKarat);
    const calculatorMarkup = calculatorBaseCost * (markupPercentage / 100);
    const calculatorFinalPrice = calculatorBaseCost + calculatorMarkup;

    return (
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
                        <span className="text-muted-foreground">{dict.marketplace.supplier.pricingPage.calculator.markup} ({markupPercentage}%):</span>
                        <span className="font-medium">${calculatorMarkup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>{dict.marketplace.supplier.pricingPage.calculator.finalPrice}</span>
                        <span className="text-green-600">${calculatorFinalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
