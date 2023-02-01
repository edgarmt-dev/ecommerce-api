function validationErrors({ errors }) {
  const errorsData = Object.keys(errors).map((item) => ({
    field: item,
    message: errors[item].message,
  }));

  return {
    success: false,
    errorsData,
    code: 400,
  };
}

module.exports = validationErrors;
