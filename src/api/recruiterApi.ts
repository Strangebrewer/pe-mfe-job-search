import BaseApi from "./baseApi";

class RecruiterApi extends BaseApi {
  constructor() {
    super('recruiters');
  }
}

export default new RecruiterApi();