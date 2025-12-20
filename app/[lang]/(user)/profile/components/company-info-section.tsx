'use client';

import React, { useEffect, useState } from 'react';
import { getCompanyInfo, updateCompanyInfo, CompanyInfo } from '@/services/getCompanyInfo';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Box, BoxContent, BoxTitle } from '@/components/box';
import { EditIcon, Loader2, Building2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useUsersKYCData } from '@/app/[lang]/(user)/admin/services/use-users-kyc';

interface CompanyInfoSectionProps {
    dict: any;
    lang: string;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ dict, lang }) => {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<CompanyInfo>({});
    const {users,isLoading,mutate} = useUsersKYCData()

    useEffect(() => {
        if (!isLoading && users?.length > 0) {
            const company = users[0].company;
            setCompanyInfo(company ?? null);
            setEditData(company ?? {});
        }
    }, [users, isLoading]);


    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updated = await updateCompanyInfo(editData);
            setCompanyInfo(updated);
            setIsEditing(false);
            toast.success('Company information updated successfully');
        } catch (error) {
            console.error('Error saving company info:', error);
            toast.error('Failed to update company information');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof CompanyInfo, value: string) => {
        setEditData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (isLoading) {
        return (
            <Box>
                <BoxContent className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </BoxContent>
            </Box>
        );
    }

    return (
        <Box>
            <div className="flex items-center justify-between">
                <BoxTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                </BoxTitle>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditData(companyInfo || {})}>
                            <EditIcon className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Company Information</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Name</Label>
                                <Input
                                    id="name"
                                    value={editData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={editData.country || ''}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    placeholder="Country"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registration">Registration Number</Label>
                                <Input
                                    id="registration"
                                    value={editData.registration_number || ''}
                                    onChange={(e) => handleInputChange('registration_number', e.target.value)}
                                    placeholder="Registration number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tax_id">Tax ID</Label>
                                <Input
                                    id="tax_id"
                                    value={editData.tax_id || ''}
                                    onChange={(e) => handleInputChange('tax_id', e.target.value)}
                                    placeholder="Tax ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bank_name">Bank Name</Label>
                                <Input
                                    id="bank_name"
                                    value={editData.bank_name || ''}
                                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                    placeholder="Bank name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iban">IBAN</Label>
                                <Input
                                    id="iban"
                                    value={editData.iban || ''}
                                    onChange={(e) => handleInputChange('iban', e.target.value)}
                                    placeholder="IBAN"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="swift">SWIFT</Label>
                                <Input
                                    id="swift"
                                    value={editData.swift || ''}
                                    onChange={(e) => handleInputChange('swift', e.target.value)}
                                    placeholder="SWIFT code"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    value={editData.currency || ''}
                                    onChange={(e) => handleInputChange('currency', e.target.value)}
                                    placeholder="Currency"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
                                <p className="text-xs font-semibold text-gray-500 uppercase">Company Name</p>
                                <p className="text-sm font-medium">{companyInfo.name}</p>
                            </div>
                        )}
                        {companyInfo.country && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Country</p>
                                <p className="text-sm font-medium">{companyInfo.country}</p>
                            </div>
                        )}
                        {companyInfo.registration_number && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Registration Number</p>
                                <p className="text-sm font-medium">{companyInfo.registration_number}</p>
                            </div>
                        )}
                        {companyInfo.tax_id && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Tax ID</p>
                                <p className="text-sm font-medium">{companyInfo.tax_id}</p>
                            </div>
                        )}
                        {companyInfo.bank_name && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Bank Name</p>
                                <p className="text-sm font-medium">{companyInfo.bank_name}</p>
                            </div>
                        )}
                        {companyInfo.iban && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">IBAN</p>
                                <p className="text-sm font-medium">{companyInfo.iban}</p>
                            </div>
                        )}
                        {companyInfo.swift && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">SWIFT</p>
                                <p className="text-sm font-medium">{companyInfo.swift}</p>
                            </div>
                        )}
                        {companyInfo.currency && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Currency</p>
                                <p className="text-sm font-medium">{companyInfo.currency}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No company information added yet.</p>
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
