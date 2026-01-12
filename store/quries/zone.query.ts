import api from "@/config/api.config";

class ZoneQuery {
  async getZoneByPosition(pos: { lat: number; lng: number }) {
    try {
      const res = await api.get(
        `/zone/position?lat=${pos.lat}&lng=${pos.lng}`
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}


export const zoneQuery = new ZoneQuery();