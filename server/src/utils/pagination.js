const paginateQuery = async (Model, {
  query = {},
  page = 1,
  limit = 10,
  sort = { createdAt: -1 },
  populate = [],
}) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  let dbQuery = Model.find(query).sort(sort).skip(skip).limit(safeLimit);

  populate.forEach((entry) => {
    dbQuery = dbQuery.populate(entry);
  });

  const [items, total] = await Promise.all([
    dbQuery,
    Model.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

module.exports = { paginateQuery };
