// app/[lang]/(user)/broker/components/guarantee-types.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Pencil, Power } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabase';
import { useGlobalContext } from '@/contexts/store';

interface GuaranteeTypesProps {
    dict: any;
}

export default function GuaranteeTypes({ dict }: GuaranteeTypesProps) {
    const { user } = useGlobalContext();
    const [guaranteeTypes, setGuaranteeTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        profit_share: 0
    });

    useEffect(() => {
        fetchGuaranteeTypes();
    }, []);

    const fetchGuaranteeTypes = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('talanow_guarantee_types')
                .select('*')
                .eq('owner', String(user.id))
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGuaranteeTypes(data || []);
        } catch (error) {
            console.error('Error fetching guarantee types:', error);
            toast.error(dict.marketplace.supplier.guaranteeTypes.messages.fetchError);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error(dict.marketplace.supplier.guaranteeTypes.messages.titleRequired);
            return;
        }

        if (!user?.id) {
            toast.error(dict.marketplace.supplier.guaranteeTypes.messages.userError);
            return;
        }

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('talanow_guarantee_types')
                    .update({
                        name: formData.name,
                        description: formData.description,
                        profit_share: formData.profit_share,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingId);

                if (error) throw error;
                toast.success(dict.marketplace.supplier.guaranteeTypes.messages.updateSuccess);
            } else {
                const { error } = await supabase
                    .from('talanow_guarantee_types')
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        profit_share: formData.profit_share,
                        owner: String(user.id),
                        status: 'active'
                    }]);

                if (error) throw error;
                toast.success(dict.marketplace.supplier.guaranteeTypes.messages.addSuccess);
            }

            setFormData({ name: '', description: '', profit_share: 0 });
            setEditingId(null);
            fetchGuaranteeTypes();
        } catch (error) {
            console.error('Error saving guarantee type:', error);
            toast.error(dict.marketplace.supplier.guaranteeTypes.messages.saveError);
        }
    };

    const handleEdit = (type: any) => {
        setFormData({
            name: type.name,
            description: type.description || '',
            profit_share: type.profit_share || 0
        });
        setEditingId(type.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(dict.marketplace.supplier.guaranteeTypes.messages.deleteConfirm)) return;

        try {
            const { error } = await supabase
                .from('talanow_guarantee_types')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success(dict.marketplace.supplier.guaranteeTypes.messages.deleteSuccess);
            fetchGuaranteeTypes();
        } catch (error) {
            console.error('Error deleting guarantee type:', error);
            toast.error(dict.marketplace.supplier.guaranteeTypes.messages.deleteError);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const { error } = await supabase
                .from('talanow_guarantee_types')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            const statusText = newStatus === 'active' ? dict.marketplace.supplier.guaranteeTypes.table.active : dict.marketplace.supplier.guaranteeTypes.table.inactive;
            toast.success(`${dict.marketplace.supplier.guaranteeTypes.messages.statusChanged} "${statusText}"`);
            fetchGuaranteeTypes();
        } catch (error) {
            console.error('Error toggling guarantee type status:', error);
            toast.error(dict.marketplace.supplier.guaranteeTypes.messages.statusError);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{dict.marketplace.supplier.guaranteeTypes.title}</h2>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{dict.marketplace.supplier.guaranteeTypes.fields.title}</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={dict.marketplace.supplier.guaranteeTypes.fields.placeholder}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profit_share">{dict.marketplace.supplier.guaranteeTypes.fields.profitShare}</Label>
                            <Input
                                id="profit_share"
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.profit_share}
                                onChange={(e) => setFormData({ ...formData, profit_share: Number(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="description">{dict.marketplace.supplier.guaranteeTypes.fields.description}</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        {editingId && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setFormData({ name: '', description: '', profit_share: 0 });
                                    setEditingId(null);
                                }}
                            >
                                {dict.marketplace.supplier.guaranteeTypes.actions.cancel}
                            </Button>
                        )}
                        <Button type="submit">
                            {editingId ? dict.marketplace.supplier.guaranteeTypes.actions.update : dict.marketplace.supplier.guaranteeTypes.actions.saveNew}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{dict.marketplace.supplier.guaranteeTypes.table.title}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{dict.marketplace.supplier.guaranteeTypes.table.profitShare}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{dict.marketplace.supplier.guaranteeTypes.table.description}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{dict.marketplace.supplier.guaranteeTypes.table.status}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{dict.marketplace.supplier.guaranteeTypes.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        {dict.marketplace.supplier.guaranteeTypes.table.loading}
                                    </td>
                                </tr>
                            ) : guaranteeTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        {dict.marketplace.supplier.guaranteeTypes.table.noItems}
                                    </td>
                                </tr>
                            ) : (
                                guaranteeTypes.map((type) => (
                                    <tr key={type.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.profit_share}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{type.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${type.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {type.status === 'active' ? dict.marketplace.supplier.guaranteeTypes.table.active : dict.marketplace.supplier.guaranteeTypes.table.inactive}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex justify-end space-x-2 space-x-reverse">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 p-0 ${type.status === 'active'
                                                            ? 'text-orange-600 hover:text-orange-800'
                                                            : 'text-green-600 hover:text-green-800'
                                                        }`}
                                                    onClick={() => handleToggleStatus(type.id, type.status)}
                                                    title={type.status === 'active' ? dict.marketplace.supplier.guaranteeTypes.actions.deactivate : dict.marketplace.supplier.guaranteeTypes.actions.activate}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                                                    onClick={() => handleEdit(type)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(type.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
