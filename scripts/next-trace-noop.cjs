const Module = require("module");
const path = require("path");

const originalLoad = Module._load;
const targetSuffix = path.join("next", "dist", "trace", "report", "to-json.js");
const noopReporter = {
  __esModule: true,
  default: {
    flushAll: async () => {},
    report: () => {}
  }
};

Module._load = function patchedLoad(request, parent, isMain) {
  try {
    const resolved = Module._resolveFilename(request, parent, isMain);

    if (typeof resolved === "string" && resolved.endsWith(targetSuffix)) {
      return noopReporter;
    }
  } catch {
    // Fall through to the default loader.
  }

  return originalLoad.apply(this, arguments);
};
