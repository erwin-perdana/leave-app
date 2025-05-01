export interface Leave {
    id?: string;
    employeeId: string;
    reason: string;
    startDate: Date;
    endDate: Date;
    status?: 'pending' | 'approved' | 'rejected';
}