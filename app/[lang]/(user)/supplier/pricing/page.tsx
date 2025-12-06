import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockPricingConfig, mockProducts } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { PricingContent } from './pricing-content';

interface PageProps {
    params: { lang: Locale };
}

export default async function SupplierPricingPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    const config = mockPricingConfig;
    const goldPriceChange = 1.2; // Mock 24h change
    const activeProducts = mockProducts.filter(p => p.status === 'active');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.supplier.pricingPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.supplier.pricingPage.description}</p>
            </div>

            {/* Live Gold Price Card - Server rendered */}
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

            {/* Pricing Content - Client for interactive config and calculator */}
            <PricingContent
                dict={dict}
                products={activeProducts}
                initialConfig={{
                    spotPricePerGram: config.spotPricePerGram,
                    markupPercentage: config.markupPercentage,
                    automaticPricing: config.automaticPricing,
                }}
            />
        </div>
    );
}
