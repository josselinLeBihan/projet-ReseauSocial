require("dotenv").config();
const mongoose = require("mongoose");
const Community = require("../models/community.model");
const communities = require("../data/communities.json");
const LOG = console.log;

mongoose.set("strictQuery", false);

const connectDB = async () => {
    
    const URI = process.env.MONGODB_URI
    LOG(URI)

  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    LOG("✅ Connecté à Mongo-DB");

    const existingCommunities = await Community.find({}, { name: 1 });

    const existingCommunityNames = existingCommunities.map((c) => c.name);

    const newCommunities = communities.filter(
      (community) => !existingCommunityNames.includes(community.name)
    );

    const newCommunitiesCount = newCommunities.length;
    if (newCommunitiesCount > 0) {
      await Community.insertMany(newCommunities);
      LOG("✅ Fait! Ajouter " + newCommunitiesCount + "nouvelle communauté dans la base de donnée")
    } else {
      LOG("⚠️ Attention: Toutes les communautées existe déjà dans la base de données")
    }

    mongoose.connection.close();
  } catch (error) {
    LOG("❌ERREUR : " + error.message)
    process.exit(1);
  }
};

connectDB();
