export type OtpMeta = {
    phone: string;
    session_id: string;
    resend_at: number;
    attempts_left: number;
    created_at: number;
}