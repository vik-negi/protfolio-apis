export const withErrorHandling = (handler, reqData, reqParams) => {
  return async (req, res) => {
    if (!reqData) reqData = [];
    const missingFields = reqData.filter((field) => !req.body[field]);
    if (!reqParams) reqParams = [];
    const missingParams = reqParams.filter((field) => !req.params[field]);
    if (missingFields.length > 0 || missingParams.length > 0) {
      return res.status(400).send({
        message: `Required fields missing: ${
          missingFields.length > 0 ? missingFields.join(", ") : ""
        } ${missingParams.length > 0 ? missingParams.join(", ") : ""}`,
      });
    }
    try {
      return await handler(req, res);
    } catch (error) {
      console.log("error catch ", error);
      return res.status(500).json({
        message: error.message,
      });
    }
  };
};

export const withErrorHandling2 = async (
  req,
  res,
  handler,
  reqData,
  reqParams
) => {
  console.log(req.body);
  if (!reqData) reqData = [];
  const missingFields = reqData.filter((field) => !req.body[field]);
  if (!reqParams) reqParams = [];
  console.log("missingFieldmissingParams");
  const missingParams = reqParams.filter((field) => !req.params[field]);
  if (missingFields.length > 0 || missingParams.length > 0) {
    return res.status(400).send({
      message: `Required fields missing: ${
        missingFields.length > 0 ? missingFields.join(", ") : ""
      } ${missingParams.length > 0 ? missingParams.join(", ") : ""}`,
    });
  }
  try {
    return await handler(req, res);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
