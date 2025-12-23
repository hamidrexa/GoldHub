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
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useGlobalContext } from '@/contexts/store';
import { IdCardIcon } from '@radix-ui/react-icons';

interface CompanyInfoSectionProps {
    dict: any;
    lang: string;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
    dict,
    lang,
}) => {
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
                    <DialogContent className="max-w-2xl">
                        <DialogHeader className="items-start">
                            <DialogTitle>Edit Company Information</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
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
                            <div className="flex flex-col gap-2">
                                <div className="space-y-2">
                                    <Label>Incorporation Certificate</Label>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'incorporation_certificate',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Director ID</Label>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'director_id',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Address Proof</Label>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(
                                                'address_proof',
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Business Licence</Label>
                                    <Input
                                        type="file"
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
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
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

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {companyInfo.incorporation_certificate && (
                                    <a
                                        href={
                                            companyInfo.incorporation_certificate
                                        }
                                        target="_blank"
                                        className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm transition hover:border-blue-300 hover:bg-blue-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium text-gray-800">
                                                Incorporation Certificate
                                            </span>
                                        </div>
                                        <Download className="h-4 w-4 text-blue-600" />
                                    </a>
                                )}

                                {companyInfo.director_id && (
                                    <a
                                        href={companyInfo.director_id}
                                        target="_blank"
                                        className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm transition hover:border-green-300 hover:bg-green-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <IdCardIcon className="h-4 w-4 text-green-600" />
                                            <span className="font-medium text-gray-800">
                                                Director ID
                                            </span>
                                        </div>
                                        <Download className="h-4 w-4 text-green-600" />
                                    </a>
                                )}

                                {companyInfo.address_proof && (
                                    <a
                                        href={companyInfo.address_proof}
                                        target="_blank"
                                        className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm transition hover:border-purple-300 hover:bg-purple-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-purple-600" />
                                            <span className="font-medium text-gray-800">
                                                Address Proof
                                            </span>
                                        </div>
                                        <Download className="h-4 w-4 text-purple-600" />
                                    </a>
                                )}

                                {companyInfo.business_licence && (
                                    <a
                                        href={companyInfo.business_licence}
                                        target="_blank"
                                        className="hover:border-orange-300 flex items-center justify-between gap-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm transition hover:bg-orange-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="text-orange-600 h-4 w-4" />
                                            <span className="font-medium text-gray-800">
                                                Business Licence
                                            </span>
                                        </div>
                                        <Download className="text-orange-600 h-4 w-4" />
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
    );
};
