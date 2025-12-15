import { config } from "dotenv";
import axios from "axios";

config();

const options = {
  method: "POST",
  url: "https://control.msg91.com/api/v5/otp",
  params: {
    otp_expiry: "5",
    template_id: "",
    mobile: "9939878713",
    authkey: process.env.MSG91_AUTH_KEY!,
    realTimeResponse: "",
  },
  headers: {
    "content-type": "application/json",
    "Content-Type": "application/JSON",
  },
  data: '{\n  "Param1": "value1",\n  "Param2": "value2",\n  "Param3": "value3"\n}',
};

const sendOTP = async () => {
  try {
    const { data } = await axios.request(options);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

export default sendOTP;
