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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Product, Stone } from '@/lib/mock-data';
import { Upload, Trash2, Loader2, Plus, X, FileCheck } from 'lucide-react';
import { addImage } from '@/app/[lang]/(user)/supplier/services/add-image';
import { deleteImage } from '@/app/[lang]/(user)/supplier/services/delete-image';

interface ProductFormDialogEnhancedProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: any | null;
    onSave?: (product: FormData) => Promise<any>;
    dict: any;
}

interface ProductFormData {
    name: string;
    sku: string;
    description: string;
    category: Product['category'];
    status: Product['status'];
    images: (File | { id: number; image: string })[];

    // Specs
    metalType: string;
    metalColor: string;
    purity: number;
    weight: string; // Net weight
    grossWeight: string;
    stones: Stone[];

    // B2B & Pricing
    price: string;
    stock: number;
    moq: number;
    countryOfOrigin: string;

    // Certification
    certificationType: string;
    certificateFile: File | string | null;

    specifications: string; // Legacy
}

export default function ProductFormDialogEnhanced({
    open,
    onOpenChange,
    product,
    onSave,
    dict,
}: ProductFormDialogEnhancedProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const certInputRef = React.useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('general');

    const initialFormState: ProductFormData = {
        name: '',
        sku: '',
        description: '',
        category: 'gold_bar',
        status: 'active',
        images: [],

        metalType: 'gold',
        metalColor: 'yellow',
        purity: 0,
        weight: '',
        grossWeight: '',
        stones: [],

        price: '',
        stock: 0,
        moq: 1,
        countryOfOrigin: '',

        certificationType: '',
        certificateFile: null,

        specifications: '',
    };

    const [formData, setFormData] = useState<ProductFormData>(initialFormState);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || product.title || '',
                sku: product.SKU || '',
                description: product.details || '',
                category: mapCategory(product.category),
                status: product.status || 'active',
                images: product.images || [],

                metalType: product.metal_type || 'gold',
                metalColor: product.metal_color || 'yellow',
                purity: product.purity || 0,
                weight: product.net_weight?.toString() || '',
                grossWeight:
                    product.gross_weight?.toString() ||
                    product.net_weight?.toString() ||
                    '',
                stones: product.stones || [],

                price: product.unit_price?.toString() || '',
                stock: product.inventory || product.stock || 0,
                moq: product.minimum_order_quantity || 1,
                countryOfOrigin: product.country_of_region || '',

                certificationType: product.certification_type || '',
                certificateFile: product.certificate_file || null,

                specifications: product.details || product.specifications || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [product, open]);

    const handleSave = async () => {
        if (!formData.name || !formData.price || !formData.weight) {
            // validation
        }

        setIsSaving(true);
        try {
            const payload = mapFormToApi(formData, product?.id);
            const savedProduct = await onSave?.(payload);

            if (savedProduct?.id) {
                const newImages = formData.images.filter(
                    (img) => img instanceof File
                ) as File[];
                if (newImages.length > 0) {
                    await Promise.all(
                        newImages.map((file) => addImage(savedProduct.id, file))
                    );
                }
            }
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save product', error);
        } finally {
            setIsSaving(false);
        }
    };

    console.log(product);

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
                console.error('Failed to delete image', error);
            }
        }
        setIndexToDelete(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData({
                ...formData,
                images: [...formData.images, ...files],
            });
        }
    };

    const handleCertSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, certificateFile: e.target.files[0] });
        }
    };

    const handleAddStone = () => {
        setFormData({
            ...formData,
            stones: [
                ...formData.stones,
                {
                    id: `st-${Date.now()}`,
                    type: 'Diamond',
                    count: 1,
                    weight: 0.1,
                    unit: 'ct',
                    clarity: 'SI1',
                    color: 'H',
                },
            ],
        });
    };

    const handleRemoveStone = (index: number) => {
        const newStones = [...formData.stones];
        newStones.splice(index, 1);
        setFormData({ ...formData, stones: newStones });
    };

    const updateStone = (index: number, field: keyof Stone, value: any) => {
        const newStones = [...formData.stones];
        newStones[index] = { ...newStones[index], [field]: value };
        setFormData({ ...formData, stones: newStones });
    };

    function mapFormToApi(formData: ProductFormData, id?: number) {
        const fd = new FormData();
        // ... (Similar mapping logic to previous, ensuring all fields are added)
        if (id) fd.append('id', id.toString());
        fd.append('title', formData.name);
        fd.append('SKU', formData.sku);
        fd.append('details', formData.description);
        fd.append('category', formData.category);

        fd.append('metal_type', formData.metalType);
        fd.append('metal_color', formData.metalColor);
        fd.append('purity', formData.purity.toString());
        fd.append('net_weight', formData.weight);
        fd.append('gross_weight', formData.grossWeight);

        //fd.append("stones", JSON.stringify(formData.stones));

        fd.append('unit_price', formData.price);

        fd.append('inventory', formData.stock.toString());
        fd.append('minimum_order_quantity', formData.moq.toString());
        fd.append('country_of_region', formData.countryOfOrigin);

        fd.append('certificate_type', formData.certificationType);
        // Certificate file handling would be here (if real API)

        fd.append('status', formData.status);

        if (formData.stones.length > 0) {
            formData.stones.forEach(({ type, count, weight, clarity, color }) => {
                const stonePayload = {
                    type,
                    count,
                    weight,
                    clarity,
                    color,
                };

                fd.append('stones', JSON.stringify(stonePayload));
            });
        }

        return fd;
    }

    function mapCategory(apiCategory: string) {
        const mapping: any = {
            Gold: 'gold_bar',
            Coin: 'gold_coin',
            Jewelry: 'jewelry',
            Ring: 'ring',
            Bracelet: 'bracelet',
            Necklace: 'necklace',
            Earring: 'earring',
        };
        return [
            'gold_bar',
            'gold_coin',
            'jewelry',
            'ring',
            'bracelet',
            'necklace',
            'earring',
        ].includes(apiCategory)
            ? apiCategory
            : mapping[apiCategory] || 'gold_bar';
    }

    const t = dict.marketplace.supplier.productFormDialogEnhanced;
    // Fallback for cert labels if not yet loaded in dict
    const certLabels = t.fields.inventory.cert || {
        title: 'Certification',
        type: 'Certificate Type',
        file: 'Upload Certificate',
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto sm:w-full">
                    <DialogHeader className="items-start">
                        <DialogTitle>
                            {product ? t.title.edit : t.title.add}{' '}
                            <span className="text-muted-foreground ml-2 text-xs font-normal">
                                (Enhanced)
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {product ? t.description.edit : t.description.add}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="general">
                                {t.tabs.general}
                            </TabsTrigger>
                            <TabsTrigger value="specifications">
                                {t.tabs.specifications}
                            </TabsTrigger>
                            <TabsTrigger value="b2b">{t.tabs.b2b}</TabsTrigger>
                        </TabsList>

                        {/* GENERAL TAB */}
                        <TabsContent value="general" className="space-y-4 py-4">
                            {/* ... (Same Name, Category, SKU, Description, Status, Images) ... */}
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            {t.fields.name.label}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder={
                                                t.fields.name.placeholder
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="product-category">
                                            {t.fields.category}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(
                                                value: Product['category']
                                            ) =>
                                                setFormData({
                                                    ...formData,
                                                    category: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger id="product-category">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="gold_bar">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.goldBar
                                                    }
                                                </SelectItem>
                                                <SelectItem value="gold_coin">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.goldCoin
                                                    }
                                                </SelectItem>
                                                <SelectItem value="jewelry">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.jewelry
                                                    }
                                                </SelectItem>
                                                <SelectItem value="necklace">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.necklace
                                                    }
                                                </SelectItem>
                                                <SelectItem value="bracelet">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.bracelet
                                                    }
                                                </SelectItem>
                                                <SelectItem value="earring">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.earring
                                                    }
                                                </SelectItem>
                                                <SelectItem value="ring">
                                                    {
                                                        dict.marketplace
                                                            .supplier
                                                            .productsPage
                                                            .categories.ring
                                                    }
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sku">
                                        {t.fields.sku.label}
                                        <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                sku: e.target.value,
                                            })
                                        }
                                        placeholder={t.fields.sku.placeholder}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        {t.fields.description.label}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder={
                                            t.fields.description.placeholder
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">
                                        {t.fields.status}
                                        <span className="text-red-600">*</span>
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(
                                            value: Product['status']
                                        ) =>
                                            setFormData({
                                                ...formData,
                                                status: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                {
                                                    dict.marketplace.supplier
                                                        .productsPage.status
                                                        .active
                                                }
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                {
                                                    dict.marketplace.supplier
                                                        .productsPage.status
                                                        .inactive
                                                }
                                            </SelectItem>
                                            <SelectItem value="draft">
                                                {
                                                    dict.marketplace.supplier
                                                        .productsPage.status
                                                        .draft
                                                }
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label>{t.fields.image.label}</Label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {formData.images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden rounded-lg border"
                                            >
                                                <img
                                                    src={
                                                        img instanceof File
                                                            ? URL.createObjectURL(
                                                                  img
                                                              )
                                                            : img.image
                                                    }
                                                    alt={`Product ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIndexToDelete(index)
                                                    }
                                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-2 text-white shadow-sm transition-all hover:bg-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <div
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="hover:bg-muted/50 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors"
                                        >
                                            <Upload className="text-muted-foreground mb-2 h-6 w-6" />
                                            <span className="text-muted-foreground text-center text-xs">
                                                {t.fields.image.clickToUpload}
                                            </span>
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
                            </div>
                        </TabsContent>

                        {/* SPECIFICATIONS TAB */}
                        <TabsContent
                            value="specifications"
                            className="space-y-4 py-4"
                        >
                            {/* ... (Metal Details, Weight, Stones) ... */}
                            <div className="grid gap-4">
                                <h3 className="text-foreground text-sm font-semibold">
                                    {t.fields.metalDetails.title}
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="metalType">
                                            {t.fields.metalDetails.type}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={formData.metalType}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    metalType: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger id="metalType">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="gold">
                                                    Gold
                                                </SelectItem>
                                                <SelectItem value="silver">
                                                    Silver
                                                </SelectItem>
                                                <SelectItem value="platinum">
                                                    Platinum
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="metalColor">
                                            {t.fields.metalDetails.color}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={formData.metalColor}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    metalColor: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger id="metalColor">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yellow">
                                                    Yellow
                                                </SelectItem>
                                                <SelectItem value="white">
                                                    White
                                                </SelectItem>
                                                <SelectItem value="rose">
                                                    Rose
                                                </SelectItem>
                                                <SelectItem value="two_tone">
                                                    Two-Tone
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="karat">
                                            {t.fields.metalDetails.purity}
                                        </Label>
                                        <Select
                                            value={
                                                formData.purity.toString() + 'K'
                                            }
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    purity: parseInt(value),
                                                })
                                            }
                                        >
                                            <SelectTrigger id="karat">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="18">
                                                    {
                                                        t.fields.karat.options[
                                                            '18k'
                                                        ]
                                                    }
                                                </SelectItem>
                                                <SelectItem value="22">
                                                    {
                                                        t.fields.karat.options[
                                                            '22k'
                                                        ]
                                                    }
                                                </SelectItem>
                                                <SelectItem value="24">
                                                    {
                                                        t.fields.karat.options[
                                                            '24k'
                                                        ]
                                                    }
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="weight">
                                            {t.fields.dimensions.netWeight}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="weight"
                                            value={formData.weight}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    weight: e.target.value,
                                                })
                                            }
                                            inputMode="decimal"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="grossWeight">
                                            {t.fields.dimensions.grossWeight}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="grossWeight"
                                            value={formData.grossWeight}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    grossWeight: e.target.value,
                                                })
                                            }
                                            inputMode="decimal"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-foreground text-sm font-semibold">
                                            {t.fields.stones.title}
                                        </h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddStone}
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            {t.fields.stones.add}
                                        </Button>
                                    </div>

                                    {formData.stones.length === 0 && (
                                        <div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
                                            No stones added
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {formData.stones.map((stone, index) => (
                                            <div
                                                key={stone.id || index}
                                                className="bg-muted/20 grid grid-cols-12 items-end gap-2 rounded-md border p-3"
                                            >
                                                <div className="col-span-3">
                                                    <Label className="text-xs">
                                                        {t.fields.stones.type}
                                                    </Label>
                                                    <Input
                                                        value={stone.type}
                                                        onChange={(e) =>
                                                            updateStone(
                                                                index,
                                                                'type',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">
                                                        {t.fields.stones.count}
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        value={stone.count}
                                                        onChange={(e) =>
                                                            updateStone(
                                                                index,
                                                                'count',
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">
                                                        {t.fields.stones.weight}
                                                    </Label>
                                                    <Input
                                                        value={stone.weight}
                                                        onChange={(e) =>
                                                            updateStone(
                                                                index,
                                                                'weight',
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">
                                                        {
                                                            t.fields.stones
                                                                .clarity
                                                        }
                                                    </Label>
                                                    <Input
                                                        value={
                                                            stone.clarity || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateStone(
                                                                index,
                                                                'clarity',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">
                                                        {t.fields.stones.color}
                                                    </Label>
                                                    <Input
                                                        value={
                                                            stone.color || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateStone(
                                                                index,
                                                                'color',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive h-8 w-8"
                                                        onClick={() =>
                                                            handleRemoveStone(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* B2B & PRICING TAB */}
                        <TabsContent value="b2b" className="space-y-4 py-4">
                            {/* ... (Pricing, Inventory, Certifications) ... */}
                            <div className="grid gap-4">
                                <h3 className="text-foreground text-sm font-semibold">
                                    {t.fields.pricing.title}
                                </h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">
                                        {t.fields.pricing.basePrice}
                                        <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        inputMode="decimal"
                                    />
                                </div>

                                <h3 className="text-foreground pt-2 text-sm font-semibold">
                                    {t.fields.inventory.title}
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="stock">
                                            {t.fields.inventory.stock}
                                        </Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    stock:
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="moq">
                                            {t.fields.inventory.moq}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="moq"
                                            type="number"
                                            value={formData.moq}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    moq:
                                                        parseInt(
                                                            e.target.value
                                                        ) || 1,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="countryOfOrigin">
                                            {t.fields.inventory.countryOfOrigin}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="countryOfOrigin"
                                            value={formData.countryOfOrigin}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    countryOfOrigin:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <h3 className="text-foreground pt-2 text-sm font-semibold">
                                    {certLabels.title}
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="certificationType">
                                            {certLabels.type}
                                        </Label>
                                        <Select
                                            value={formData.certificationType}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    certificationType: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger id="certificationType">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BIS">
                                                    BIS Hallmarked
                                                </SelectItem>
                                                <SelectItem value="GIA">
                                                    GIA
                                                </SelectItem>
                                                <SelectItem value="IGI">
                                                    IGI
                                                </SelectItem>
                                                <SelectItem value="Other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="certificateFile">
                                            {certLabels.file}
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="certificateFile"
                                                type="file"
                                                ref={certInputRef}
                                                className="hidden"
                                                onChange={handleCertSelect}
                                            />
                                            <Button
                                                variant="outline"
                                                type="button"
                                                className="text-muted-foreground w-full justify-start"
                                                onClick={() =>
                                                    certInputRef.current?.click()
                                                }
                                            >
                                                <FileCheck className="mr-2 h-4 w-4" />
                                                {formData.certificateFile
                                                    ? typeof formData.certificateFile ===
                                                      'string'
                                                        ? 'Certificate Attached'
                                                        : formData
                                                              .certificateFile
                                                              .name
                                                    : 'Click to upload'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            {t.actions.cancel}
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-yellow-500 text-black hover:bg-yellow-600"
                            disabled={isSaving}
                        >
                            {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {product ? t.actions.update : t.actions.add}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reuse Delete Dialog */}
            <AlertDialog
                open={indexToDelete !== null}
                onOpenChange={(open) => !open && setIndexToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{'Confirm'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this image? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteImage}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
