export type UserBaseRole = 'buyer' | 'supplier' | 'admin';
export type UserRoleStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'unknown';

export interface ParsedUserRole {
    baseRole: UserBaseRole;
    status: UserRoleStatus;
    rawRole: string | null;
}

const ROLE_KEYWORDS: UserBaseRole[] = ['buyer', 'supplier', 'admin'];

export function parseUserRole(rawRole?: string | null, isSuperUser?: boolean): ParsedUserRole {
    if (isSuperUser) {
        return {
            baseRole: 'admin',
            status: 'active',
            rawRole: rawRole ?? 'admin',
        };
    }

    if (!rawRole) {
        return {
            baseRole: 'buyer',
            status: 'pending',
            rawRole: null,
        };
    }

    const normalized = rawRole.toLowerCase();

    let baseRole: UserBaseRole = 'buyer';
    const matchedRole = ROLE_KEYWORDS.find((role) => normalized.includes(role));
    if (matchedRole) {
        baseRole = matchedRole;
    }

    let status: UserRoleStatus = 'active';
    if (normalized.includes('pending') || normalized.includes('request') || normalized.includes('requested') || normalized.includes('not_approved')) {
        status = 'pending';
    } else if (normalized.includes('approved')) {
        status = 'approved';
    } else if (normalized.includes('reject')) {
        status = 'rejected';
    }

    return {
        baseRole,
        status,
        rawRole: rawRole,
    };
}
