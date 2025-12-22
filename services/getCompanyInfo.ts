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
 * Update user company information
 */
export async function updateCompanyInfo(
    data: CompanyInfo,
    files?: {
        incorporation_certificate?: File;
        director_id?: File;
        address_proof?: File;
        business_licence?: File;
    }
): Promise<CompanyInfo> {
    try {
        const token = Cookies.get('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();

        // Text fields
        if (data.name) formData.append('name', data.name);
        if (data.country) formData.append('country', data.country);
        if (data.registration_number)
            formData.append('registration_number', data.registration_number);
        if (data.tax_id) formData.append('tax_id', data.tax_id);
        if (data.bank_name) formData.append('bank_name', data.bank_name);
        if (data.iban) formData.append('iban', data.iban);
        if (data.swift) formData.append('swift', data.swift);
        if (data.currency) formData.append('currency', data.currency);

        // File fields
        if (files?.incorporation_certificate) {
            formData.append(
                'incorporation_certificate',
                files.incorporation_certificate
            );
        }

        if (files?.director_id) {
            formData.append('director_id', files.director_id);
        }

        if (files?.address_proof) {
            formData.append('address_proof', files.address_proof);
        }

        if (files?.business_licence) {
            formData.append('business_licence', files.business_licence);
        }

        const response = await fetch(
            `${API_BASE_URL}/v1/gold_artifacts/user_company_update`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to update company info: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating company info:', error);
        throw error;
    }
}
