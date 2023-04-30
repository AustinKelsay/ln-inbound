/** src/model/slug.js */

const PubSchema = {
  /** Configure the collection's schema.
   * https://docs.mongodb.com/manual/core/schema-validation/
   */
  bsonType: "object",

  required: [ 
    "host", "pubkey", "status", "purchased", "expires", "receipt" 
  ],
  
  properties: {
    host: {
      bsonType: "string",
      maxLength: 32,
      description: "Must be a string and is required."
    },
    pubkey: {
      bsonType: "string",
      maxLength: 64,
      description: "Must be a string and is required."
    },
    relays: {
      bsonType: [ "string" ]
    },
    status: {
      bsonType: [ "string" ]
    },
    purchased: {
      bsonType: [ "number" ],
    },
    expires: {
      bsonType: [ "number" ]
    },
    receipt: {
      bsonType: [ "string" ]
    }
  }
}

export const PubModel = {
  // Name of the collection.
  name: 'pubkeys',

  indexes: [
    /** Configure the collection's indexes.
     * https://docs.mongodb.com/manual/reference/command/createIndexes
     */
    {
      name: "_lookup_",
      key: { host: 1, pubkey: 1, purchased: -1, expires: -1, invoice: 1 },
      unique: true
    }
  ],
  options: {
    validator: { $jsonSchema: PubSchema },
    validationLevel: "strict",
    validationAction: "error"
  }
}
