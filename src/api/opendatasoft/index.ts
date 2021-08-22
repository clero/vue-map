import makeClient from './client';
import adaptEnterprises from './adapter/enterprise';
import type {
  OpendatasoftRecordsApiV1,
  OpendatasoftRecordsApiV2,
} from './types';

export default makeClient;
export { OpendatasoftRecordsApiV1, OpendatasoftRecordsApiV2, adaptEnterprises };
