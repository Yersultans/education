const socket = require("./socket");

const mongoDB = {
    devEndPoint: "mongodb+srv://yers:W0KJcP4J-@cluster0-re8hh.mongodb.net/education?retryWrites=true&w=majority"
};

const SECRET_KEY =
  "dkasmdmaskfndjkgnfjdnlsdmejwnrfefjkervfnjkfmklsamdejwkoivnfkkndgsdfo";

  const AIRTABLE_API_KEY = "key9zpFqBLvHoLJmx";

  const whitelist = process.env.AllowedUrls;
  const isDevMode = process.env.NODE_ENV !== "production";
  const isStageMode = process.env.NODE_ENV === "STAGING";
  const isProd = process.env.NODE_ENV === "production";
  const isTest = process.env.NODE_ENV === "test";
  const localUrl = "http://localhost:5001";
  
  const s3 = {
    SECRET_ACCESS_KEY: "84AXxrRICp1XOPPNr4cCWKAm5c7ZUVfDzRiP9jmB",
    ACCESS_KEY_ID: "AKIA2WUGRGFCGQCOJZFS",
    BUCKET_NAME: "explorerpass-submission-assets",
    REGION: "Asia Pacific (Singapore)"
  };

  const getMongoEndpoint = () => {
    return mongoDB.devEndPoint;
};

const config = {
    mongoDB,
    getMongoEndpoint,
    SECRET_KEY,
    AIRTABLE_API_KEY,
    whitelist,
    isDevMode,
    socket,
    isStageMode,
    isProd,
    isTest,
    localUrl
};

module.exports = config;