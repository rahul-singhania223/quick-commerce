import { api } from "../axios.config";

class AuthService {
  async getAuthUser(): Promise<any> {
    try {
        const res = api.get("/user")
        return res
    } catch (error) {
      throw error;
    }
  }

  async getOtp(phone: string): Promise<any> {
    try {
        const res = api.post("/user/get-otp", { phone })
        return res
    } catch (error) {
      throw error;
    }
  }

  async getOtpMetaData({session_id, phone}: { session_id: string; phone: string }): Promise<any> {
    try {
        const res = api.get(`/user/otp-status?session_id=${session_id}&phone=${phone}`)
        return res
    } catch (error) {
      throw error;
    }
  }


  async verifyOTP({ OTP, phone, session_id }: { OTP: string; phone: string; session_id: string }): Promise<any> {
    try {
        const res = api.post("/user/verify-otp", {
          OTP,
          phone,
          session_id
        })
        return res
    } catch (error) {
      throw error;
    }

  }

  async logout() {
    try {
        const res = api.get("/user/logout")
        return res
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
