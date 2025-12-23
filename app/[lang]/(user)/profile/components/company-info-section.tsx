'use client';

import React, { useEffect, useState } from 'react';
import { updateCompanyInfo, CompanyInfo } from '@/services/getCompanyInfo';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Box, BoxContent, BoxTitle } from '@/components/box';
import {
    EditIcon,
    Loader2,
    Building2,
    Download,
    Briefcase,
    MapPin,
    FileText,
    Upload,
    Trash2,
    File,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { useGlobalContext } from '@/contexts/store';
import { IdCardIcon } from '@radix-ui/react-icons';

interface CompanyInfoSectionProps {
    dict: any;
    lang: string;
}

interface DocumentPreview {
    type: 'incorporation_certificate' | 'director_id' | 'address_proof' | 'business_licence';
    file?: File;
    url?: string;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
    dict,
    lang,
}) => {
    const fileInputRefs = {
        incorporation_certificate: React.useRef<HTMLInputElement>(null),
        director_id: React.useRef<HTMLInputElement>(null),
        address_proof: React.useRef<HTMLInputElement>(null),
        business_licence: React.useRef<HTMLInputElement>(null),
    };

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<CompanyInfo>({});
    const { user, isUserLoading } = useGlobalContext();
    const [files, setFiles] = useState<{
        incorporation_certificate?: File;
        director_id?: File;
        address_proof?: File;
        business_licence?: File;
    }>({});
    const [documentToDelete, setDocumentToDelete] = useState<DocumentPreview['type'] | null>(null);

    useEffect(() => {
        setCompanyInfo(user.company);
    }, [user]);

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const formData = new FormData();

            // append text fields
            Object.entries(editData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string);
                }
            });

            // append files
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formData.append(key, file);
                }
            });

            const updated = await updateCompanyInfo(editData, files);
            setCompanyInfo(updated);
            setIsEditing(false);
            toast.success('Company information updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update company information');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof CompanyInfo, value: string) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (field: keyof typeof files, file?: File) => {
        if (!file) return;
        setFiles((prev) => ({ ...prev, [field]: file }));
    };

    const handleDeleteDocument = (docType: DocumentPreview['type']) => {
        setFiles((prev) => ({ ...prev, [docType]: undefined }));
        setEditData((prev) => ({ ...prev, [docType]: null }));
        setDocumentToDelete(null);
    };

    const getDocumentLabel = (docType: DocumentPreview['type']): string => {
        const labels: Record<DocumentPreview['type'], string> = {
            incorporation_certificate: 'Incorporation Certificate',
            director_id: 'Director ID',
            address_proof: 'Address Proof',
            business_licence: 'Business Licence',
        };
        return labels[docType];
    };

    const getDocumentIcon = (docType: DocumentPreview['type']) => {
        const icons: Record<DocumentPreview['type'], React.ReactNode> = {
            incorporation_certificate: <FileText className="h-4 w-4" />,
            director_id: <IdCardIcon className="h-4 w-4" />,
            address_proof: <MapPin className="h-4 w-4" />,
            business_licence: <Briefcase className="h-4 w-4" />,
        };
        return icons[docType];
    };

    const hasDocument = (docType: DocumentPreview['type']): boolean => {
        return !!(files[docType] || editData[docType as keyof CompanyInfo]);
    };

    if (isUserLoading) {
        return (
            <Box>
                <BoxContent className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </BoxContent>
            </Box>
        );
    }

    return (
        <>
            <Box>
                <div className="flex items-center justify-between">
                    <BoxTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Information
                    </BoxTitle>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditData(companyInfo || {})}
                        >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader className="items-start">
                            <DialogTitle>Edit Company Information</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Name</Label>
                                <Input
                                    id="name"
                                    value={editData.name || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={editData.country || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'country',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Country"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registration">
                                    Registration Number
                                </Label>
                                <Input
                                    id="registration"
                                    value={editData.registration_number || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'registration_number',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Registration number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tax_id">Tax ID</Label>
                                <Input
                                    id="tax_id"
                                    value={editData.tax_id || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'tax_id',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Tax ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bank_name">Bank Name</Label>
                                <Input
                                    id="bank_name"
                                    value={editData.bank_name || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'bank_name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Bank name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iban">IBAN</Label>
                                <Input
                                    id="iban"
                                    value={editData.iban || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'iban',
                                            e.target.value
                                        )
                                    }
                                    placeholder="IBAN"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="swift">SWIFT</Label>
                                <Input
                                    id="swift"
                                    value={editData.swift || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'swift',
                                            e.target.value
                                        )
                                    }
                                    placeholder="SWIFT code"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    value={editData.currency || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'currency',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Currency"
                                />
                            </div>
                        </div>

                        {/* Documents Upload Section */}
                        <div className="space-y-4 border-t pt-6">
                            <Label className="text-base font-semibold">Company Documents</Label>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Incorporation Certificate */}
                                <div className="space-y-2">
                                    <Label>{getDocumentLabel('incorporation_certificate')}</Label>
                                    <div className="relative aspect-square rounded-lg border-2 border-dashed overflow-hidden group cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                        onClick={() => fileInputRefs.incorporation_certificate.current?.click()}
                                    >
                                        {hasDocument('incorporation_certificate') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                                                <span className="text-xs text-gray-600 text-center px-2">
                                                    {files.incorporation_certificate?.name || 'File selected'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDocumentToDelete('incorporation_certificate');
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-2 rounded-full transition-all hover:bg-red-600 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground text-center px-2">
                                                    Click to upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRefs.incorporation_certificate}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'incorporation_certificate',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>

                                {/* Director ID */}
                                <div className="space-y-2">
                                    <Label>{getDocumentLabel('director_id')}</Label>
                                    <div className="relative aspect-square rounded-lg border-2 border-dashed overflow-hidden group cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                        onClick={() => fileInputRefs.director_id.current?.click()}
                                    >
                                        {hasDocument('director_id') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <IdCardIcon className="h-8 w-8 text-green-600 mb-2" />
                                                <span className="text-xs text-gray-600 text-center px-2">
                                                    {files.director_id?.name || 'File selected'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDocumentToDelete('director_id');
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-2 rounded-full transition-all hover:bg-red-600 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground text-center px-2">
                                                    Click to upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRefs.director_id}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'director_id',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>

                                {/* Address Proof */}
                                <div className="space-y-2">
                                    <Label>{getDocumentLabel('address_proof')}</Label>
                                    <div className="relative aspect-square rounded-lg border-2 border-dashed overflow-hidden group cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                        onClick={() => fileInputRefs.address_proof.current?.click()}
                                    >
                                        {hasDocument('address_proof') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <MapPin className="h-8 w-8 text-purple-600 mb-2" />
                                                <span className="text-xs text-gray-600 text-center px-2">
                                                    {files.address_proof?.name || 'File selected'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDocumentToDelete('address_proof');
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-2 rounded-full transition-all hover:bg-red-600 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground text-center px-2">
                                                    Click to upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRefs.address_proof}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'address_proof',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>

                                {/* Business Licence */}
                                <div className="space-y-2">
                                    <Label>{getDocumentLabel('business_licence')}</Label>
                                    <div className="relative aspect-square rounded-lg border-2 border-dashed overflow-hidden group cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                        onClick={() => fileInputRefs.business_licence.current?.click()}
                                    >
                                        {hasDocument('business_licence') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <Briefcase className="h-8 w-8 text-orange-600 mb-2" />
                                                <span className="text-xs text-gray-600 text-center px-2">
                                                    {files.business_licence?.name || 'File selected'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDocumentToDelete('business_licence');
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-2 rounded-full transition-all hover:bg-red-600 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground text-center px-2">
                                                    Click to upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRefs.business_licence}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'business_licence',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <BoxContent>
                {companyInfo ? (
                    <div className="grid grid-cols-2 gap-4">
                        {companyInfo.name && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Company Name
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.name}
                                </p>
                            </div>
                        )}
                        {companyInfo.country && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Country
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.country}
                                </p>
                            </div>
                        )}
                        {companyInfo.registration_number && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Registration Number
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.registration_number}
                                </p>
                            </div>
                        )}
                        {companyInfo.tax_id && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Tax ID
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.tax_id}
                                </p>
                            </div>
                        )}
                        {companyInfo.bank_name && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Bank Name
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.bank_name}
                                </p>
                            </div>
                        )}
                        {companyInfo.iban && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    IBAN
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.iban}
                                </p>
                            </div>
                        )}
                        {companyInfo.swift && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    SWIFT
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.swift}
                                </p>
                            </div>
                        )}
                        {companyInfo.currency && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    Currency
                                </p>
                                <p className="text-sm font-medium">
                                    {companyInfo.currency}
                                </p>
                            </div>
                        )}
                        <div className="col-span-2 border-t pt-6">
                            <p className="mb-3 text-sm font-semibold text-gray-500">
                                Company Documents
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {companyInfo.incorporation_certificate && (
                                    <a
                                        href={
                                            companyInfo.incorporation_certificate
                                        }
                                        target="_blank"
                                        className="relative aspect-square rounded-lg border-2 overflow-hidden flex flex-col items-center justify-center group cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="h-8 w-8 text-blue-600" />
                                            <span className="text-xs font-medium text-gray-800 text-center px-2">
                                                Incorporation Certificate
                                            </span>
                                        </div>
                                        <Download className="absolute top-2 right-2 h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}

                                {companyInfo.director_id && (
                                    <a
                                        href={companyInfo.director_id}
                                        target="_blank"
                                        className="relative aspect-square rounded-lg border-2 overflow-hidden flex flex-col items-center justify-center group cursor-pointer bg-green-50 hover:bg-green-100 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <IdCardIcon className="h-8 w-8 text-green-600" />
                                            <span className="text-xs font-medium text-gray-800 text-center px-2">
                                                Director ID
                                            </span>
                                        </div>
                                        <Download className="absolute top-2 right-2 h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}

                                {companyInfo.address_proof && (
                                    <a
                                        href={companyInfo.address_proof}
                                        target="_blank"
                                        className="relative aspect-square rounded-lg border-2 overflow-hidden flex flex-col items-center justify-center group cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <MapPin className="h-8 w-8 text-purple-600" />
                                            <span className="text-xs font-medium text-gray-800 text-center px-2">
                                                Address Proof
                                            </span>
                                        </div>
                                        <Download className="absolute top-2 right-2 h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}

                                {companyInfo.business_licence && (
                                    <a
                                        href={companyInfo.business_licence}
                                        target="_blank"
                                        className="relative aspect-square rounded-lg border-2 overflow-hidden flex flex-col items-center justify-center group cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Briefcase className="text-orange-600 h-8 w-8" />
                                            <span className="text-xs font-medium text-gray-800 text-center px-2">
                                                Business Licence
                                            </span>
                                        </div>
                                        <Download className="absolute top-2 right-2 h-4 w-4 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-gray-500">
                            No company information added yet.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setIsEditing(true)}
                        >
                            Add Company Information
                        </Button>
                    </div>
                )}
            </BoxContent>
        </Box>

        <AlertDialog open={documentToDelete !== null} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
};
