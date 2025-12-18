'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
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
import { Product } from '@/lib/mock-data';
import ProductFormDialog from '@/app/[lang]/(user)/supplier/components/product-form-dialog';
import { useProductList } from '@/app/[lang]/(user)/supplier/products/services/useProductList';
import { updateProduct } from '@/app/[lang]/(user)/supplier/products/services/updateProduct';
import { deleteProduct } from '@/app/[lang]/(user)/supplier/products/services/deleteProduct';
import { roundNumber } from '@/libs/utils';
import { useGlobalContext } from '@/contexts/store';
import { deleteImage } from '@/app/[lang]/(user)/supplier/services/delete-image';

interface ProductsGridProps {
    dict: any;
}

export function ProductsGrid({ dict }: ProductsGridProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useGlobalContext()
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { products: list = [], isLoading, mutate } = useProductList(user?.username);

    const getStatusBadge = (status: Product['status']) => {
        const badges = {
            active: { label: dict.marketplace.supplier.productsPage.status.active, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            inactive: { label: dict.marketplace.supplier.productsPage.status.inactive, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            draft: { label: dict.marketplace.supplier.productsPage.status.draft, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
        };
        const config = badges[status];
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

    const handleEditProduct = (product: any) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleDeleteClick = (product: any) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        
        try {
            setIsDeleting(true);
            await deleteProduct({ product_id: productToDelete.id });
            mutate();
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Failed to delete product:', error);
            // Optionally show error toast here
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!list || list.length === 0) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">{dict.marketplace.supplier.productsPage.noProducts}</p>
            </div>
        );
    }

    return (
        <>
            {list.map((product) => (
                <div
                    key={product.id}
                    className="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg"
                >
                    {/* Product Image */}
                    <div className="relative flex aspect-square items-center justify-center border-b bg-gray-100">
                        {product.images?.length ? (
                            <>
                                <img
                                    src={product.images[0].image}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                />

                                {/* Delete Image Button */}
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        await deleteImage(product.images[0].id);
                                        mutate();
                                    }}
                                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-red-600 transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <ImageIcon className="h-16 w-16 text-gray-400" />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3 p-4">
                        <div>
                            <h3 className="mb-1 text-base font-semibold">
                                {product.title}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                {product.details}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xl font-bold text-green-600">
                                    ${product.price?.toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {roundNumber(product.weight, 2)}{' '}
                                    grams
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {product.inventory ?? 0}{' '}
                                    {
                                        dict.marketplace.supplier.productsPage
                                            .inStock
                                    }
                                </p>
                            </div>
                            {getStatusBadge('active')}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 border-t pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEditProduct(product)}
                            >
                                <Pencil className="mr-1 h-3 w-3" />
                                {dict.marketplace.supplier.productsPage.edit}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteClick(product)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <ProductFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                dict={dict}
                onSave={async (apiBody) => {
                    const res = await updateProduct({
                        body: apiBody,
                        product_id: selectedProduct?.id,
                    });
                    mutate();
                    return res;
                }}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The product &quot;{productToDelete?.title}&quot; will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
