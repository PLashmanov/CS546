import {dbConnection} from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};
const users = getCollectionFn('users');
const fraudsters = getCollectionFn('fraudsters');
const reports = getCollectionFn('reports');
export {users, fraudsters, reports}; 
