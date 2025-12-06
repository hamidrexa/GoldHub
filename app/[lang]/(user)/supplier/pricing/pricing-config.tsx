'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PricingConfigProps {
    dict: any;
    initialAutomaticPricing: boolean;
    initialMarkupPercentage: number;
    onConfigChange?: (config: { automaticPricing: boolean; markupPercentage: number }) => void;
}

export function PricingConfig({
    dict,
    initialAutomaticPricing,
    initialMarkupPercentage,
    onConfigChange
}: PricingConfigProps) {
    const [automaticPricing, setAutomaticPricing] = useState(initialAutomaticPricing);
    const [markupPercentage, setMarkupPercentage] = useState(initialMarkupPercentage);

    const handleAutomaticChange = (checked: boolean) => {
        setAutomaticPricing(checked);
        onConfigChange?.({ automaticPricing: checked, markupPercentage });
    };

    const handleMarkupChange = (value: number) => {
        setMarkupPercentage(value);
        onConfigChange?.({ automaticPricing, markupPercentage: value });
    };

    return (
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
                        checked={automaticPricing}
                        onCheckedChange={handleAutomaticChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="markup">{dict.marketplace.supplier.pricingPage.configuration.markupPercentage}</Label>
                    <Input
                        id="markup"
                        type="number"
                        value={markupPercentage}
                        onChange={(e) => handleMarkupChange(parseFloat(e.target.value) || 0)}
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
                            className={automaticPricing ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                        >
                            {automaticPricing ? dict.marketplace.supplier.pricingPage.configuration.automatic : dict.marketplace.supplier.pricingPage.configuration.manualOverride}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
