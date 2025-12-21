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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from '@/lib/mock-data';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { addImage } from '@/app/[lang]/(user)/supplier/services/add-image';
import { deleteImage } from '@/app/[lang]/(user)/supplier/services/delete-image';

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: any | null;
    onSave?: (product: FormData) => Promise<any>;
    dict: any;
}
interface ProductFormData {
    name: string;
    category: Product['category'];
    karat: Product['karat'] | string;
    weight: string;
    price: string;
    stock: number;
    status: Product['status'];
    specifications: string;
    images: (File | { id: number; image: string })[];
}

export default function ProductFormDialog({
    open,
    onOpenChange,
    product,
    onSave,
    dict,
}: ProductFormDialogProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        category: "gold_bar",
        karat: "18K",
        weight: "",
        price: "",
        stock: 0,
        status: "active",
        specifications: "",
        images: [],
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.title ?? "",
                category: mapCategory(product.category),
                karat: product.karat ? `${product.karat}K` : "",
                weight: product.weight?.toString() ?? "",
                price: product.price?.toString() ?? "",
                stock: product.inventory ?? 0,
                status: product.status ?? "active",
                specifications: product.details ?? "",
                images: product.images || [],
            });
        } else {
            setFormData({
                name: "",
                category: "gold_bar",
                karat: "18K",
                weight: "",
                price: "",
                stock: 0,
                status: "active",
                specifications: "",
                images: [],
            });
        }
    }, [product, open]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = mapFormToApi(formData, product?.id);
            const savedProduct = await onSave?.(payload);

            if (savedProduct?.id) {
                const newImages = formData.images.filter(img => img instanceof File) as File[];
                await Promise.all(newImages.map(file => addImage(savedProduct.id, file)));
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save product", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteImage = async () => {
        if (indexToDelete === null) return;

        const index = indexToDelete;
        const image = formData.images[index];

        if (image instanceof File) {
            const newImages = [...formData.images];
            newImages.splice(index, 1);
            setFormData({ ...formData, images: newImages });
        } else {
            try {
                await deleteImage(image.id);
                const newImages = [...formData.images];
                newImages.splice(index, 1);
                setFormData({ ...formData, images: newImages });
            } catch (error) {
                console.error("Failed to delete image", error);
            }
        }
        setIndexToDelete(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData({ ...formData, images: [...formData.images, ...files] });
        }
    };

    const formatKarat = (karat: string): number | null => {
        if (!karat) return null;
        const match = karat.match(/\d+/);
        return match ? parseInt(match[0]) : null;
    };

    function mapFormToApi(formData: ProductFormData, id?: number) {
        const fd = new FormData();

        if (id) fd.append("id", id.toString());
        fd.append("title", formData.name);
        fd.append("category", formData.category);
        fd.append("karat", String(formatKarat(formData.karat as string)));
        fd.append("weight", formData.weight);
        fd.append("price", formData.price);
        fd.append("inventory", formData.stock.toString());
        fd.append("details", formData.specifications);
        fd.append("status", formData.status);

        return fd;
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
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                    <DialogHeader className="items-start">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="category">{dict.marketplace.supplier.productFormDialog.fields.category}</Label>
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
                                        <SelectItem
                                            value="gold_bar">{dict.marketplace.supplier.productsPage.categories.goldBar}</SelectItem>
                                        <SelectItem
                                            value="gold_coin">{dict.marketplace.supplier.productsPage.categories.goldCoin}</SelectItem>
                                        <SelectItem
                                            value="jewelry">{dict.marketplace.supplier.productsPage.categories.jewelry}</SelectItem>
                                        <SelectItem
                                            value="necklace">{dict.marketplace.supplier.productsPage.categories.necklace}</SelectItem>
                                        <SelectItem
                                            value="bracelet">{dict.marketplace.supplier.productsPage.categories.bracelet}</SelectItem>
                                        <SelectItem
                                            value="earring">{dict.marketplace.supplier.productsPage.categories.earring}</SelectItem>
                                        <SelectItem
                                            value="ring">{dict.marketplace.supplier.productsPage.categories.ring}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="karat">{dict.marketplace.supplier.productFormDialog.fields.karat.label}</Label>
                                <Select
                                    value={formData.karat as string}
                                    onValueChange={(value: Product['karat']) =>
                                        setFormData({ ...formData, karat: value })
                                    }
                                >
                                    <SelectTrigger id="karat">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="18K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['18k']}</SelectItem>
                                        <SelectItem
                                            value="22K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['22k']}</SelectItem>
                                        <SelectItem
                                            value="24K">{dict.marketplace.supplier.productFormDialog.fields.karat.options['24k']}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="weight">{dict.marketplace.supplier.productFormDialog.fields.weight}</Label>
                                <Input
                                    id="weight"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    inputMode="decimal"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">{dict.marketplace.supplier.productFormDialog.fields.price}</Label>
                                <Input
                                    id="price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    inputMode="decimal"
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
                            <Label
                                htmlFor="specifications">{dict.marketplace.supplier.productFormDialog.fields.specifications.label}</Label>
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
                                    <SelectItem
                                        value="active">{dict.marketplace.supplier.productsPage.status.active}</SelectItem>
                                    <SelectItem
                                        value="inactive">{dict.marketplace.supplier.productsPage.status.inactive}</SelectItem>
                                    <SelectItem
                                        value="draft">{dict.marketplace.supplier.productsPage.status.draft}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label>{dict.marketplace.supplier.productFormDialog.fields.image.label}</Label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                                        <img
                                            src={img instanceof File ? URL.createObjectURL(img) : img.image}
                                            alt={`Product ${index + 1}`}
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIndexToDelete(index)}
                                            className="absolute top-1 right-1 bg-black/60 text-white p-2 rounded-full transition-all hover:bg-red-600 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors aspect-square"
                                >
                                    <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground text-center">
                                        {dict.marketplace.supplier.productFormDialog.fields.image.clickToUpload}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            {dict.marketplace.supplier.productFormDialog.actions.cancel}
                        </Button>
                        <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {product ? dict.marketplace.supplier.productFormDialog.actions.update : dict.marketplace.supplier.productFormDialog.actions.add}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={indexToDelete !== null} onOpenChange={(open) => !open && setIndexToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{'Confirm'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage} className="bg-red-600 hover:bg-red-700">
                            {'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
