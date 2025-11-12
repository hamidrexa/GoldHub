// app/[lang]/(user)/admin/components/guarantee-types.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabase';

export default function GuaranteeTypes() {
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
        try {
            const { data, error } = await supabase
                .from('talanow_guarantee_types')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGuaranteeTypes(data || []);
        } catch (error) {
            console.error('Error fetching guarantee types:', error);
            toast.error('خطا در دریافت لیست تضمین‌ها');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('عنوان تضمین الزامی است');
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
                toast.success('تضمین با موفقیت به‌روزرسانی شد');
            } else {
                const { error } = await supabase
                    .from('talanow_guarantee_types')
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        profit_share: formData.profit_share,
                        status: 'active'
                    }]);

                if (error) throw error;
                toast.success('تضمین جدید با موفقیت اضافه شد');
            }

            setFormData({ name: '', description: '', profit_share: 0 });
            setEditingId(null);
            fetchGuaranteeTypes();
        } catch (error) {
            console.error('Error saving guarantee type:', error);
            toast.error('خطا در ذخیره‌سازی تضمین');
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
        if (!confirm('آیا از حذف این نوع تضمین اطمینان دارید؟')) return;

        try {
            // First check if this guarantee type is being used
            const { count } = await supabase
                .from('talanow_contract_type_guarantees')
                .select('*', { count: 'exact', head: true })
                .eq('guarantee_type_id', id);

            if (count && count > 0) {
                toast.error('این نوع تضمین در حال استفاده است و قابل حذف نمی‌باشد');
                return;
            }

            const { error } = await supabase
                .from('talanow_guarantee_types')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('نوع تضمین با موفقیت حذف شد');
            fetchGuaranteeTypes();
        } catch (error) {
            console.error('Error deleting guarantee type:', error);
            toast.error('خطا در حذف نوع تضمین');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">مدیریت انواع تضمین‌ها</h2>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">عنوان تضمین *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="مثال: ملک، چک، سفته"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profit_share">درصد سود پیش‌فرض</Label>
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
                            <Label htmlFor="description">توضیحات (اختیاری)</Label>
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
                                انصراف
                            </Button>
                        )}
                        <Button type="submit">
                            {editingId ? 'بروزرسانی' : 'ذخیره تضمین جدید'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">درصد سود</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">توضیحات</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        در حال بارگذاری...
                                    </td>
                                </tr>
                            ) : guaranteeTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        موردی یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                guaranteeTypes.map((type) => (
                                    <tr key={type.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.profit_share}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{type.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex justify-end space-x-2 space-x-reverse">
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