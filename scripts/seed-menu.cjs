const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");

function parseEnvContent(content) {
  const values = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value.replace(/\\n/g, "\n");
  }

  return values;
}

function readEnvFile(filename) {
  try {
    const filePath = path.join(process.cwd(), filename);
    const content = fs.readFileSync(filePath, "utf8");
    return parseEnvContent(content);
  } catch {
    return {};
  }
}

function loadRuntimeEnv() {
  const env = {
    ...readEnvFile(".env"),
    ...readEnvFile(".env.local"),
    ...process.env
  };

  return {
    mongoUri: env.MONGODB_URI || env.MONGO_URI || ""
  };
}

const now = new Date();

const seedMenu = [
  {
    name: "Truffle Arancini",
    description:
      "Crisp saffron risotto, smoked pecorino, and black truffle crema finished tableside.",
    price: 1280,
    category: "Starters",
    emoji: "\u{1F358}",
    tag: "Chef's Pick",
    isAvailable: true,
    isFeatured: true,
    sortOrder: 10
  },
  {
    name: "Ocean Crudo",
    description:
      "Hamachi, yuzu oil, compressed melon, and basil blossom with a chilled citrus broth.",
    price: 1590,
    category: "Starters",
    emoji: "\u{1F41F}",
    tag: "Seasonal",
    isAvailable: true,
    isFeatured: true,
    sortOrder: 20
  },
  {
    name: "Wagyu Tenderloin",
    description:
      "Coal-seared wagyu with bone marrow jus, charred shallots, and pomme pave.",
    price: 6490,
    category: "Mains",
    emoji: "\u{1F969}",
    tag: "Signature",
    isAvailable: true,
    isFeatured: true,
    sortOrder: 30
  },
  {
    name: "Lobster Pappardelle",
    description:
      "House pasta, butter-poached lobster, fennel pollen, and shellfish velvet.",
    price: 3290,
    category: "Mains",
    emoji: "\u{1F99E}",
    tag: undefined,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 40
  },
  {
    name: "Salt-Baked Celeriac",
    description:
      "Roasted celeriac with smoked date glaze, chestnut puree, and crispy sage.",
    price: 2190,
    category: "Mains",
    emoji: "\u{1F330}",
    tag: "Vegetarian",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 50
  },
  {
    name: "Gold Leaf Millefeuille",
    description:
      "Caramelized puff pastry, vanilla diplomat, tonka bean, and edible gold finish.",
    price: 980,
    category: "Desserts",
    emoji: "\u2728",
    tag: undefined,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 60
  },
  {
    name: "Dark Chocolate Orbit",
    description:
      "Single-origin chocolate mousse, cherry compote, hazelnut praline, and cocoa tuile.",
    price: 920,
    category: "Desserts",
    emoji: "\u{1F36B}",
    tag: undefined,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 70
  },
  {
    name: "Midnight Martini",
    description:
      "Vodka, espresso reduction, black cardamom, and cacao nib crema.",
    price: 760,
    category: "Drinks",
    emoji: "\u{1F378}",
    tag: "After Hours",
    isAvailable: true,
    isFeatured: true,
    sortOrder: 80
  },
  {
    name: "Embered Pear Spritz",
    description:
      "Sparkling pear aperitif with rosemary smoke and preserved lemon brightness.",
    price: 690,
    category: "Drinks",
    emoji: "\u{1F350}",
    tag: undefined,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 90
  },
  {
    name: "Salon Degustation",
    description:
      "Seven editorial courses exploring fire, smoke, sea, and pastry in a single service.",
    price: 8490,
    category: "Tasting Menu",
    emoji: "\u{1F37D}\uFE0F",
    tag: "Reserve Ahead",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 100
  }
];

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    emoji: { type: String, required: true },
    tag: { type: String },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);

async function seedDatabase() {
  const { mongoUri } = loadRuntimeEnv();

  if (!mongoUri) {
    throw new Error("MONGODB_URI or MONGO_URI is not configured.");
  }

  await mongoose.connect(mongoUri, {
    bufferCommands: false
  });

  const operations = seedMenu.map((item) => ({
    updateOne: {
      filter: {
        name: item.name,
        category: item.category
      },
      update: {
        $set: {
          ...item,
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      upsert: true
    }
  }));

  const result = await MenuItem.bulkWrite(operations, { ordered: false });

  const seededCount = await MenuItem.countDocuments({
    $or: seedMenu.map((item) => ({
      name: item.name,
      category: item.category
    }))
  });

  console.log(
    JSON.stringify(
      {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        seededCount
      },
      null,
      2
    )
  );
}

seedDatabase()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors during CLI shutdown.
    }
  });
