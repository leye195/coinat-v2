import { RxDocument, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

export const getCollections = async () => {
  const localDB = await createRxDatabase({
    name: 'coin-db', // <- name
    storage: getRxStorageDexie(), // <- RxStorage
    ignoreDuplicate: true,
    localDocuments: false,
  });

  const coinSchema = {
    title: 'coin schema',
    version: 0,
    primaryKey: 'symbol',
    type: 'object',
    properties: {
      symbol: {
        type: 'string',
        maxLength: 50,
      },
      last: {
        type: 'number',
      },
      blast: {
        type: 'number',
      },
      convertedBlast: {
        type: 'number',
      },
      per: {
        type: 'number',
      },
    },
  };

  // collections
  const collections = await localDB.addCollections({
    krwCoins: {
      schema: coinSchema,
    },
    btcCoins: {
      schema: coinSchema,
    },
  });

  return collections;
};

export const convertToJSON = (docs: RxDocument[]) => {
  return docs.map((doc) => doc.toJSON());
};
