'use client';

import React, { useState } from 'react';
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
    product?: Product | null;
    onSave?: (product: Partial<Product>) => void;
}

export default function ProductFormDialog({
    open,
    onOpenChange,
    product,
    onSave,
}: ProductFormDialogProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: product?.name || '',
        category: product?.category || 'gold_bar',
        karat: product?.karat || '24K',
        weight: product?.weight || 0,
        price: product?.price || 0,
        stock: product?.stock || 0,
        status: product?.status || 'active',
        specifications: product?.specifications || '',
    });

    const handleSave = () => {
        onSave?.(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {product ? 'Update product details below' : 'Fill in the details for your new product'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., 24K Gold Bar 100g"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
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
                                    <SelectItem value="gold_bar">Gold Bar</SelectItem>
                                    <SelectItem value="gold_coin">Gold Coin</SelectItem>
                                    <SelectItem value="jewelry">Jewelry</SelectItem>
                                    <SelectItem value="necklace">Necklace</SelectItem>
                                    <SelectItem value="bracelet">Bracelet</SelectItem>
                                    <SelectItem value="earring">Earring</SelectItem>
                                    <SelectItem value="ring">Ring</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="karat">Karat</Label>
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
                                    <SelectItem value="18K">18K (75% pure)</SelectItem>
                                    <SelectItem value="22K">22K (91.6% pure)</SelectItem>
                                    <SelectItem value="24K">24K (100% pure)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="weight">Weight (grams)</Label>
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
                            <Label htmlFor="price">Price (USD)</Label>
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
                            <Label htmlFor="stock">Stock</Label>
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
                        <Label htmlFor="specifications">Specifications</Label>
                        <Input
                            id="specifications"
                            value={formData.specifications}
                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                            placeholder="e.g., Gold Bar · 24K · 100gram"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Product Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Click to upload image
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                (S3 integration required)
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        {product ? 'Update Product' : 'Add Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
