import BaseApi from './baseApi';

class JobApi extends BaseApi {
  constructor() {
    super('jobs');
  }

  setReported(id: string, reported: boolean) {
    return this.axiosWithAuth.put(`${this.endpoint}/${id}/reported`, { reported });
  }

  getCompanies() {
    return this.axiosWithAuth.get(`${this.endpoint}/companies`);
  }
}

export default new JobApi();
