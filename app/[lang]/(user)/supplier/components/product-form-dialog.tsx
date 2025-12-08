'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Product } from '@/lib/mock-data';
import { Upload } from 'lucide-react';

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: any | null;
    onSave?: (product) => void;
    dict: any;
}

export default function ProductFormDialog({
    open,
    onOpenChange,
    product,
    onSave,
    dict,
}: ProductFormDialogProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        category: "gold_bar",
        karat: "18K",
        weight: 0,
        price: 0,
        stock: 0,
        status: "active",
        specifications: "",
        image: "",
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.title ?? "",
                category: mapCategory(product.category),
                karat: product.karat ?? null,
                weight: parseFloat(product.weight) ?? 0,
                price: parseFloat(product.price) ?? 0,
                stock: product.inventory ?? 0,
                status: product.status ?? "active",
                specifications: product.details ?? "",
                image: product.images?.[0]?.image ?? "",
            });
        }
    }, [product]);

    const handleSave = () => {
        const payload = mapFormToApi(formData, product?.id);
        onSave?.(payload);
        onOpenChange(false);
    };

    const formatKarat = (karat: string): number | null => {
        if (!karat) return null;
        const match = karat.match(/\d+/);
        return match ? parseInt(match[0]) : null;
    };


    function mapFormToApi(formData, id?: number) {
        return {
            id,
            title: formData.name,
            category: formData.category,
            karat: formatKarat(formData.karat),
            weight: formData.weight,
            price: formData.price,
            inventory: formData.stock,
            details: formData.specifications,
            image: formData.image,
            status: formData.status,
        };
    }

    function mapCategory(apiCategory: string) {
        const mapping: any = {
            Gold: "gold_bar",
            Coin: "gold_coin",
            Jewelry: "jewelry",
            Ring: "ring",
            Bracelet: "bracelet",
            Necklace: "necklace",
            Earring: "earring",
        };
        return mapping[apiCategory] || "gold_bar";
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? dict.marketplace.supplier.productFormDialog.title.edit : dict.marketplace.supplier.productFormDialog.title.add}</DialogTitle>
                    <DialogDescription>
                        {product ? dict.marketplace.supplier.productFormDialog.description.edit : dict.marketplace.supplier.productFormDialog.description.add}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{dict.marketplace.supplier.productFormDialog.fields.name.label}</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={dict.marketplace.supplier.productFormDialog.fields.name.placeholder}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">{dict.marketplace.supplier.productFormDialog.fields.category}</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value: Product['category']) =>
                                    setFormData({ ...formData, category: value })
                                }
                            >
                                <SelectTrigger id="category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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

                        <div className="grid gap-2">
                            <Label htmlFor="karat">{dict.marketplace.supplier.productFormDialog.fields.karat.label}</Label>
                            <Select
                                value={formData.karat}
                                onValueChange={(value: Product['karat']) =>
                                    setFormData({ ...formData, karat: value })
                                }
                            >
                                <SelectTrigger id="karat">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="18K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['18k']}</SelectItem>
                                    <SelectItem value="22K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['22k']}</SelectItem>
                                    <SelectItem value="24K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['24k']}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="weight">{dict.marketplace.supplier.productFormDialog.fields.weight}</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) =>
                                    setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })
                                }
                                step="0.1"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">{dict.marketplace.supplier.productFormDialog.fields.price}</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                                }
                                step="0.01"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock">{dict.marketplace.supplier.productFormDialog.fields.stock}</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="specifications">{dict.marketplace.supplier.productFormDialog.fields.specifications.label}</Label>
                        <Input
                            id="specifications"
                            value={formData.specifications}
                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                            placeholder={dict.marketplace.supplier.productFormDialog.fields.specifications.placeholder}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">{dict.marketplace.supplier.productFormDialog.fields.status}</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: Product['status']) =>
                                setFormData({ ...formData, status: value })
                            }
                        >
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">{dict.marketplace.supplier.productsPage.status.active}</SelectItem>
                                <SelectItem value="inactive">{dict.marketplace.supplier.productsPage.status.inactive}</SelectItem>
                                <SelectItem value="draft">{dict.marketplace.supplier.productsPage.status.draft}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">{dict.marketplace.supplier.productFormDialog.fields.image.label}</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {dict.marketplace.supplier.productFormDialog.fields.image.clickToUpload}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {dict.marketplace.supplier.productFormDialog.fields.image.s3Required}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {dict.marketplace.supplier.productFormDialog.actions.cancel}
                    </Button>
                    <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        {product ? dict.marketplace.supplier.productFormDialog.actions.update : dict.marketplace.supplier.productFormDialog.actions.add}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
