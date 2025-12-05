'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { mockProducts, Product } from '@/lib/mock-data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProductFormDialog from '@/app/[lang]/(user)/supplier/components/product-form-dialog';

interface SupplierProductsClientProps {
    dict: any;
}

export default function SupplierProductsClient({ dict }: SupplierProductsClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const getStatusBadge = (status: Product['status']) => {
        const badges = {
            active: { label: dict.marketplace.supplier.productsPage.status.active, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            inactive: { label: dict.marketplace.supplier.productsPage.status.inactive, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            draft: { label: dict.marketplace.supplier.productsPage.status.draft, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
        };
        const config = badges[status];
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

    const filterProducts = (products: Product[]) => {
        let filtered = products;

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.specifications?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        return filtered;
    };

    const filteredProducts = filterProducts(mockProducts);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.supplier.productsPage.title}</h1>
                    <p className="text-muted-foreground">{dict.marketplace.supplier.productsPage.description}</p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedProduct(null);
                        setDialogOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {dict.marketplace.supplier.productsPage.addProduct}
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={dict.marketplace.supplier.productsPage.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={dict.marketplace.supplier.productsPage.category} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{dict.marketplace.supplier.productsPage.categories.all}</SelectItem>
                        <SelectItem value="gold_bar">{dict.marketplace.supplier.productsPage.categories.goldBar}</SelectItem>
                        <SelectItem value="gold_coin">{dict.marketplace.supplier.productsPage.categories.goldCoin}</SelectItem>
                        <SelectItem value="jewelry">{dict.marketplace.supplier.productsPage.categories.jewelry}</SelectItem>
                        <SelectItem value="necklace">{dict.marketplace.supplier.productsPage.categories.necklace}</SelectItem>
                        <SelectItem value="bracelet">{dict.marketplace.supplier.productsPage.categories.bracelet}</SelectItem>
                        <SelectItem value="earring">{dict.marketplace.supplier.productsPage.categories.earring}</SelectItem>
                        <SelectItem value="ring">{dict.marketplace.supplier.productsPage.categories.ring}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">{dict.marketplace.supplier.productsPage.noProducts}</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-lg border bg-white overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Product Image */}
                            <div className="aspect-square bg-gray-100 flex items-center justify-center border-b">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="h-16 w-16 text-gray-400" />
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {product.specifications}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xl font-bold text-green-600">
                                            ${product.price.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.stock} {dict.marketplace.supplier.productsPage.inStock}
                                        </p>
                                    </div>
                                    {getStatusBadge(product.status)}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-3 w-3 mr-1" />
                                        {dict.marketplace.supplier.productsPage.edit}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Product Form Dialog */}
            <ProductFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                onSave={(product) => {
                    console.log('Product saved:', product);
                    // In a real app, this would call an API to save the product
                }}
                dict={dict}
            />
        </div>
    );
}
