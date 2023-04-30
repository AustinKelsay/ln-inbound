/** src/controller.js */

import { connect } from './db'

const devMode = process.env.NODE_ENV !== 'production'

export async function getCollection(schema : any) {
  /** Returns a collection based upon the provided schema, 
   *  either fetching an existing collection or creating 
   *  a new one. Ensures the stored schema is up-to-date.
   */
  const { name, indexes, options } = schema,
        { cacheDb: db, collections } = await connect();

  // If the requested collection is not listed, create it.
  let cache = collections.find((c : any) => c.name === name);

  if (cache === undefined) {
    const coll = await db.createCollection(name, options);
    await coll.createIndexes(indexes);
    return coll;
  }

  if (devMode) {
    if (
      cache.options !== undefined &&
      isDiff(cache.options, options)
    ) {
      // Update collection options if model has changed.
      // Note: Requies dbAdmin privileges.
      try {
        await db.command({ collMod: name, ...options })
      } catch(err) { console.error(err) }
    }
  }

  // Load collection from the database.
  const coll = db.collection(name)

  // Refresh collection indexes if model has changed.
  if (isDiff(cache.indexes, indexes)) {
    await coll.dropIndexes()
    await coll.createIndexes(indexes)
  }
  
  return coll
}

function isDiff(a : object, b : object) {
  /** Helper function for quickly comparing objects. */
  return (JSON.stringify(a) !== JSON.stringify(b))
}
