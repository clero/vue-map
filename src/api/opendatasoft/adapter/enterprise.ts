import { OpendatasoftRecordsApiV1 } from '../types';
import { Enterprise } from '@/types';

const adapt = (records: OpendatasoftRecordsApiV1): Enterprise[] =>
  records.records.map(
    ({
      recordid: id,
      fields: {
        geolocetablissement: [latitude, longitude],
        adresseetablissement,
        libellecommuneetablissement,
        classeetablissement: description,
        l1_adressage_unitelegale: name,
        categorieentreprise: type,
        siren,
      },
    }) => ({
      id,
      name,
      type,
      description,
      siren,
      address: `${adresseetablissement}, ${libellecommuneetablissement}`,
      location: { latitude, longitude },
    })
  );

export default adapt;
