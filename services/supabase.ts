import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncuxwtvkhpnriwsamqaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXh3dHZraHBucml3c2FtcWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTEzMTMsImV4cCI6MjA3NjY2NzMxM30.QjoyT6gYgLJaP_vcKf0xUyPXeJpmC3n8n9N3eWjv7DE';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

// Interfaces for your tables
export interface BrokerLink {
    member_id: string;
    broker_id: string;
    created_at?: string;
}

export interface ContractType {
    id: string;
    name: string;
    description?: string;
    min_investment?: number;
    max_investment?: number;
    guarantee_type: ('ملک' | 'چک' | 'سفته')[];
    min_duration_months: number;
    max_duration_months: number;
    settlement_type: ('آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه')[];
    profit_share?: number;
    active?: boolean;
    created_at?: string;
    status?: string;
}

export interface BrokerContractType {
    broker_id: string;
    contract_type_id: string;
}

export interface Contract {
    id: string;
    user_id: string;
    broker_id: string;
    contract_type_id: string;
    amount_rls: number;
    guarantee_type?: 'ملک' | 'چک' | 'سفته';
    duration_months: number;
    settlement_type: 'آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه';
    status: string;
    created_at?: string;
}

// Functions to interact with your tables
export const getBrokers = async () => {
    // Assuming brokers are users with the 'broker' role in your application logic
    // You might need to adjust this based on how you identify brokers
    const { data, error } = await supabase.from('users').select('*').eq('is_broker', true); // This is a guess
    if (error) {
        console.error('Error fetching brokers:', error);
        return [];
    }
    return data;
};

export const getBrokerMembers = async (brokerId: string) => {
    const { data, error } = await supabase
        .from('talanow_broker_member_link')
        .select('member_id, users(*)')
        .eq('broker_id', brokerId);
    if (error) {
        console.error('Error fetching broker members:', error);
        return [];
    }
    return data.map((item) => item.users);
};

export const getBrokerSummary = async (brokerId: string) => {
    const { count: memberCount, error: memberError } = await supabase
        .from('talanow_broker_member_link')
        .select('*', { count: 'exact', head: true })
        .eq('broker_id', brokerId);

    const { count: activeContractsCount, error: contractsError } = await supabase
        .from('talanow_contracts')
        .select('*', { count: 'exact', head: true })
        .eq('broker_id', brokerId)
        .eq('status', 'active'); // Assuming 'active' is a status

    if (memberError || contractsError) {
        console.error('Error fetching broker summary:', memberError || contractsError);
        return { memberCount: 0, activeContractsCount: 0 };
    }

    return { memberCount: memberCount ?? 0, activeContractsCount: activeContractsCount ?? 0 };
};

export const getContractTypesForBroker = async (brokerId: string) => {
    const { data, error } = await supabase
        .from('talanow_broker_contract_types_link')
        .select('talanow_contract_types(*)')
        .eq('broker_id', brokerId);

    if (error) {
        console.error('Error fetching contract types for broker:', error);
        return [];
    }
    // Corrected mapping logic
    return data.map((item) => item.talanow_contract_types || []);
};

export const getBrokerContractsSummary = async (brokerId: string) => {
    const { count: contractTypesCount, error: contractTypesError } = await supabase
        .from('talanow_broker_contract_types_link')
        .select('*', { count: 'exact', head: true })
        .eq('broker_id', brokerId);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data: profitData, error: profitError } = await supabase
        .from('talanow_contracts')
        .select('amount_rls, contract_types(profit_share)')
        .eq('broker_id', brokerId)
        .gte('created_at', oneMonthAgo.toISOString());

    if (contractTypesError || profitError) {
        console.error('Error fetching broker contracts summary:', contractTypesError || profitError);
        return { contractTypesCount: 0, lastMonthProfit: 0 };
    }

    const lastMonthProfit = profitData
        ? profitData.reduce((sum, item) => {
              // Handle contract_types as object or array
              let profitShare = 0;
              if (item.contract_types) {
                  if (Array.isArray(item.contract_types)) {
                      // If array, use first element
                      profitShare = item.contract_types[0]?.profit_share ?? 0;
                  } else {
                      profitShare = (item.contract_types as any)?.profit_share ?? 0;
                  }
              }
              return sum + item.amount_rls * (profitShare / 100);
          }, 0)
        : 0;

    return { contractTypesCount: contractTypesCount ?? 0, lastMonthProfit };
};

export const getBrokerMembershipForUser = async (memberId: string) => {
    const { data, error } = await supabase
        .from('talanow_broker_member_link')
        .select('*')
        .eq('member_id', memberId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching broker membership:', error);
        return { data: null, error };
    }

    return { data, error: null };
};

export const linkMemberToBroker = async (memberId: string, brokerId: string) => {
    const { data, error } = await supabase
        .from('talanow_broker_member_link')
        .upsert(
            { member_id: memberId, broker_id: brokerId },
            { onConflict: 'member_id' }
        )
        .select();

    if (error) {
        console.error('Error linking member to broker:', error);
        return { data: null, error };
    }

    return { data: data?.[0] ?? null, error: null };
};

export const createContractType = async (contractTypeData: Partial<ContractType>) => {
    const { data, error } = await supabase.from('talanow_contract_types').insert(contractTypeData).select();
    if (error) {
        console.error('Error creating contract type:', error);
        return null;
    }
    return data;
};

export const updateContractType = async (id: string, updates: Partial<ContractType>) => {
    const { data, error } = await supabase.from('talanow_contract_types').update(updates).eq('id', id).select();
    if (error) {
        console.error('Error updating contract type:', error);
        return null;
    }
    return data;
};

export const deactivateContractType = async (id: string) => {
    const { data, error } = await supabase.from('talanow_contract_types').update({ active: false }).eq('id', id).select();
    if (error) {
        console.error('Error deactivating contract type:', error);
        return null;
    }
    return data;
};

export const createContract = async (contractData: Partial<Contract>) => {
    const { data, error } = await supabase.from('talanow_contracts').insert(contractData).select();
    if (error) {
        console.error('Error creating contract:', error);
        return null;
    }
    return data;
};

export const getContractsForUser = async (userId: string) => {
    const { data, error } = await supabase.from('talanow_contracts').select('*, talanow_contract_types(*)').eq('user_id', userId);
    if (error) {
        console.error('Error fetching contracts for user:', error);
        return [];
    }
    return data;
};

export const getBrokerByUsername = async (username: string) => {
    // This function assumes there's a users table or similar in Supabase
    // If the user data comes from the API, this might not be needed
    // But we can use it to get additional broker info from Supabase if needed
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
    
    if (error) {
        console.error('Error fetching broker by username:', error);
        return null;
    }
    return data;
};