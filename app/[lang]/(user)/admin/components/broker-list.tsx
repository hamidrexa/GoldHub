'use client';

import React, { useEffect, useState } from 'react';
import { getBrokers, getBrokerSummary, getBrokerMembers } from '@/services/supabase';
import { Icons } from '@/components/ui/icons';

const BrokerList = ({ dict, lang }) => {
    const [brokers, setBrokers] = useState([]);
    const [expandedBroker, setExpandedBroker] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrokers = async () => {
            setLoading(true);
            const brokersData = await getBrokers();
            const brokersWithSummary = await Promise.all(
                brokersData.map(async (broker) => {
                    const summary = await getBrokerSummary(broker.id);
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
            const membersData = await getBrokerMembers(brokerId);
            setMembers(membersData);
            setExpandedBroker(brokerId);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {brokers.map((broker) => (
                <div key={broker.id} className="mb-4 rounded-md border p-4">
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-lg font-bold">{broker.name}</h3>
                        <div className="text-sm">
                            <p>
                                {dict.admin.members}: {broker.memberCount}
                            </p>
                            <p>
                                {dict.admin.active_contracts}: {broker.activeContractsCount}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => toggleBroker(broker.id)} className="text-blue-500">
                        {expandedBroker === broker.id ? dict.admin.hide_members : dict.admin.show_members}
                    </button>
                    {expandedBroker === broker.id && (
                        <div className="mt-4">
                            <h4 className="font-bold">{dict.admin.member_list}</h4>
                            <ul>
                                {members.map((member) => (
                                    <li key={member.id}>
                                        {member.full_name} ({member.email})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BrokerList;
