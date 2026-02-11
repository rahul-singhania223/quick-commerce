import db from "../configs/db.config.js";

// Get product stats
export const fetchProductStats = async () => {
  try {
    const stats = await db.stats.findFirst({
      select: { products_count: true },
    });
    return stats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// increase product count
export const increaseProductCount = async () => {
  try {
    const stats = await db.stats.findFirst();

    const updatedStats = await db.stats.update({
      where: { id: stats?.id },
      data: stats
        ? { products_count: stats.products_count + 1 }
        : { products_count: 1 },
      select: { products_count: true },
    });

    return updatedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// decrease product count
export const decreaseProductCount = async () => {
  try {
    const stats = await db.stats.findFirst();

    const updatedStats = await db.stats.update({
      where: { id: stats?.id },
      data: stats
        ? { products_count: stats.products_count - 1 }
        : { products_count: 0 },
      select: { products_count: true },
    });

    return updatedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};
