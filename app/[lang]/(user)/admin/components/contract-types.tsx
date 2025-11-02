'use client';

import React, { useEffect, useState } from 'react';
import {
    getBrokers,
    getContractTypesForBroker,
    getBrokerContractsSummary,
    createContractType,
    updateContractType,
    deactivateContractType,
} from '@/services/supabase';
import { Icons } from '@/components/ui/icons';

const ContractTypes = ({ dict, lang }) => {
    const [brokers, setBrokers] = useState([]);
    const [expandedBroker, setExpandedBroker] = useState(null);
    const [contractTypes, setContractTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingContract, setEditingContract] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchBrokers = async () => {
            setLoading(true);
            const brokersData = await getBrokers();
            const brokersWithSummary = await Promise.all(
                brokersData.map(async (broker) => {
                    const summary = await getBrokerContractsSummary(broker.id);
                    return { ...broker, ...summary };
                })
            );
            setBrokers(brokersWithSummary);
            setLoading(false);
        };
        fetchBrokers();
    }, []);

    const toggleBroker = async (brokerId) => {
        if (expandedBroker === brokerId) {
            setExpandedBroker(null);
        } else {
            const contractTypesData = await getContractTypesForBroker(brokerId);
            setContractTypes(contractTypesData);
            setExpandedBroker(brokerId);
        }
    };

    const handleCreate = () => {
        setEditingContract({
            name: '',
            description: '',
            min_investment: 0,
            max_investment: 0,
            profit_share: 0,
            duration: 0,
            broker_id: '',
        });
        setIsCreating(true);
    };

    const handleEdit = (contract) => {
        setEditingContract(contract);
        setIsCreating(false);
    };

    const handleSave = async () => {
        if (isCreating) {
            await createContractType(editingContract);
        } else {
            await updateContractType(editingContract.id, editingContract);
        }
        setEditingContract(null);
        // Refresh data
        const contractTypesData = await getContractTypesForBroker(expandedBroker);
        setContractTypes(contractTypesData);
    };

    const handleDeactivate = async (contractId) => {
        await deactivateContractType(contractId);
        // Refresh data
        const contractTypesData = await getContractTypesForBroker(expandedBroker);
        setContractTypes(contractTypesData);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <button onClick={handleCreate} className="mb-4 rounded bg-blue-500 px-4 py-2 text-white">
                {dict.admin.create_contract}
            </button>

            {brokers.map((broker) => (
                <div key={broker.id} className="mb-4 rounded-md border p-4">
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-lg font-bold">{broker.name}</h3>
                        <div className="text-sm">
                            <p>
                                {dict.admin.contract_types}: {broker.contractTypesCount}
                            </p>
                            <p>
                                {dict.admin.last_month_profit}: {broker.lastMonthProfit}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => toggleBroker(broker.id)} className="text-blue-500">
                        {expandedBroker === broker.id ? dict.admin.hide_contracts : dict.admin.show_contracts}
                    </button>
                    {expandedBroker === broker.id && (
                        <div className="mt-4">
                            {contractTypes.map((contract) => (
                                <div key={contract.id} className="mb-2 flex items-center justify-between rounded border p-2">
                                    <div>
                                        <p className="font-bold">{contract.name}</p>
                                        <p>{contract.description}</p>
                                    </div>
                                    <div>
                                        <button onClick={() => handleEdit(contract)} className="mr-2 text-green-500">
                                            {dict.admin.edit}
                                        </button>
                                        <button onClick={() => handleDeactivate(contract.id)} className="text-red-500">
                                            {dict.admin.deactivate}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {editingContract && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-1/2 rounded-md bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">{isCreating ? dict.admin.create_contract : dict.admin.edit_contract}</h2>
                        {/* Form fields for editingContract */}
                        <button onClick={handleSave} className="rounded bg-blue-500 px-4 py-2 text-white">
                            {dict.admin.save}
                        </button>
                        <button onClick={() => setEditingContract(null)} className="ml-2 rounded bg-gray-300 px-4 py-2">
                            {dict.admin.cancel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractTypes;
