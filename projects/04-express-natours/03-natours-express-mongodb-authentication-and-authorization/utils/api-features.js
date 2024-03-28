class API_FEATURES {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObj = { ...this.queryObject };
    const eQueryFields = ["page", "limit", "sort", "fields"];
    eQueryFields.forEach((q) => delete queryObj[q]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte|eq|ne)\b/g,
      (match) => `$${match}`
    );

    const restoredQuery = JSON.parse(queryString, (key, value) => {
      const isTypeNumber =
        key === "ratingsAverage" ||
        key === "ratingsQuantity" ||
        key === "price" ||
        key === "priceDiscount";
      if (isTypeNumber && typeof value !== "object") return Number(value);
      else if (isTypeNumber && typeof value === "object") {
        const keys = Object.keys(value);
        return { [keys[0]]: Number(value[keys[0]]) };
      } else return value;
    });

    this.query = this.query.find(restoredQuery);
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortQuery = this.queryObject.sort;
      this.query = this.query.sort(sortQuery.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitingFields() {
    if (this.queryObject.fields) {
      const fieldsQuery = this.queryObject.fields;
      this.query = this.query.select(fieldsQuery.split(",").join(" "));
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.queryObject.page || 1;
    const limit = this.queryObject.limit || 20;
    const skip = (page - 1) * limit;

    /**NB::==> make sure to update error handling */
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = API_FEATURES;
