//shorthend for putting function inside function
const advancedResults = (model, populate) => async (req, res, next) => {
  //console.log(req.query)
  let query;

  //copy req.query
  const reqQuery = { ...req.query };

  //Array of fields to exclude that i dont want to be matched for filtering i.e if we donot exclude sort,select then it will think them as a field and try to match it with the fields that are in our document
  const removeFields = ["select", "sort", "page", "limit"];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach(value => delete reqQuery[value]);

  //console.log(reqQuery);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators (&gt,&gte,etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //console.log(queryStr);

  //finding resource
  query = model.find(JSON.parse(queryStr));

  //if select fields is included then do this
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  //const bootcamp = await bootcamps.find();

  //executing query
  const results = await query;

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit
    };
  }
  if (skip > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  // console.log(pagination);
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};
module.exports = advancedResults;
