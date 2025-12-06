'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import ProductFormDialog from '@/app/[lang]/(user)/supplier/components/product-form-dialog';

interface ProductActionsProps {
    dict: any;
    products: Product[];
}

export function ProductActions({ dict, products }: ProductActionsProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    return (
        <>
            <Button
                onClick={handleAddProduct}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
                <Plus className="h-4 w-4 mr-2" />
                {dict.marketplace.supplier.productsPage.addProduct}
            </Button>

            <ProductFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                onSave={(product) => {
                    console.log('Product saved:', product);
                }}
                dict={dict}
            />
        </>
    );
}

interface ProductCardActionsProps {
    dict: any;
    product: Product;
    onEdit: (product: Product) => void;
}

export function ProductCardActions({ dict, product, onEdit }: ProductCardActionsProps) {
    return (
        <div className="flex gap-2 pt-2 border-t">
            <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(product)}
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
    );
}
