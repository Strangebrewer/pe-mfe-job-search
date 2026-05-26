import BaseApi from "./baseApi";

class JobApi extends BaseApi {
  constructor() {
    super('jobs');
  }
}

export default new JobApi();
