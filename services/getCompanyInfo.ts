import Cookies from 'js-cookie';

export interface CompanyInfo {
    name?: string;
    country?: string;
    registration_number?: string;
    tax_id?: string;
    bank_name?: string;
    iban?: string;
    swift?: string;
    currency?: string;
    incorporation_certificate?: string;
    director_id?: string;
    address_proof?: string;
    business_licence?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_;

/**
 * Fetch user company information
 */
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
    try {
        const token = Cookies.get('token');
        if (!token) {
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/gold_artifacts/user_company_info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // No company info found
            }
            throw new Error(`Failed to fetch company info: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching company info:', error);
        throw error;
    }
}

/**
 * Update user company information
 */
export async function updateCompanyInfo(data: CompanyInfo): Promise<CompanyInfo> {
    try {
        const token = Cookies.get('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();

        // Add text fields
        if (data.name) formData.append('name', data.name);
        if (data.country) formData.append('country', data.country);
        if (data.registration_number) formData.append('registration_number', data.registration_number);
        if (data.tax_id) formData.append('tax_id', data.tax_id);
        if (data.bank_name) formData.append('bank_name', data.bank_name);
        if (data.iban) formData.append('iban', data.iban);
        if (data.swift) formData.append('swift', data.swift);
        if (data.currency) formData.append('currency', data.currency);

        const response = await fetch(`${API_BASE_URL}/v1/gold_artifacts/user_company_update`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to update company info: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating company info:', error);
        throw error;
    }
}
