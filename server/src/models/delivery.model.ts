// import db from "../configs/db.config.js";

// export const getNearestDeliveryPartner = async (
//   storeLat: number,
//   storeLng: number,
//   zoneId: string,
//   radiusMeters = 5000,
// ) => {
//   const result = await db.$queryRawUnsafe(
//     `
//     SELECT *,
//       ST_Distance(
//         location,
//         ST_SetSRID(ST_MakePoint($1, $2), 4326)
//       ) AS distance
//     FROM "DeliveryPartner"
//     WHERE is_active = true
//       AND zone_id = $3
//       AND ST_DWithin(
//         location,
//         ST_SetSRID(ST_MakePoint($1, $2), 4326),
//         $4
//       )
//     ORDER BY distance ASC, created_at ASC
//     LIMIT 1;
//   `,
//     storeLng,
//     storeLat,
//     zoneId,
//     radiusMeters,
//   )

//   return result[0] || null;
// };


// export const calculateDistance = async (
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number,
// ) => {
//   const result = await db.$queryRawUnsafe(
//     `
//     SELECT ST_Distance(
//       ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
//       ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
//     ) AS distance;
//   `,
//     lng1,
//     lat1,
//     lng2,
//     lat2,
//   );

//   return Number(result[0].distance); // meters
// };


// export const calculateDeliveryFee = (
//   zone: {
//     base_fee: number;
//     per_km_fee: number;
//   },
//   distanceMeters: number,
// ) => {
//   const distanceKm = distanceMeters / 1000;

//   const fee = zone.base_fee + distanceKm * zone.per_km_fee;

//   return Math.round(fee * 100) / 100;
// };

// export const calculateETA = (
//   partnerToStoreMeters: number,
//   storeToUserMeters: number,
//   avgPrepTimeMinutes: number,
//   averageSpeedKmph = 30,
// ) => {
//   const totalMeters = partnerToStoreMeters + storeToUserMeters;

//   const totalKm = totalMeters / 1000;

//   const travelTimeHours = totalKm / averageSpeedKmph;

//   const travelMinutes = travelTimeHours * 60;

//   const eta = avgPrepTimeMinutes + travelMinutes;

//   return Math.ceil(eta); // minutes
// };

