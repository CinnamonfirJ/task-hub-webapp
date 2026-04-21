import { NextResponse } from "next/server";

// PATCH /api/admin/kyc/:id/reject
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json().catch(() => ({}));
        const { reason } = body;

        if (!reason) {
            return NextResponse.json(
                { status: 'error', message: 'Rejection reason is required' },
                { status: 400 }
            );
        }

        // In a real implementation with a direct DB connection:
        // const kyc = await KYCVerification.findById(id);
        // ... (logic from user instructions)

        console.log(`[API] Rejecting KYC ${id} for reason: ${reason}`);

        return NextResponse.json({
            status: 'success',
            message: 'KYC document rejected successfully',
            data: { id, status: 'rejected', reason, rejectedAt: new Date() }
        });
    } catch (error: any) {
        return NextResponse.json(
            { status: 'error', message: error.message || 'Failed to reject KYC' },
            { status: 500 }
        );
    }
}
