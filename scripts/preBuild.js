const currentPath = process.cwd();
const fs = require("fs").promises;
const path = require("path");

const isInterface = (str) => /^I[A-Z]/.test(str);

const listSolFiles = async (directory) => {
  const solFiles = [];
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      if (file.isDirectory()) {
        try {
          const nestedFiles = await listSolFiles(fullPath);
          solFiles.push(...nestedFiles);
        } catch (nestedError) {
          console.error(
            `Error reading directory ${fullPath}:`,
            nestedError.message
          );
        }
      } else if (file.isFile() && file.name.endsWith(".sol")) {
        solFiles.push(file.name);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
    throw new Error(`Failed to list .sol files in directory ${directory}`);
  }
  return solFiles;
};

const listABIs = async (directory, excludeList) => {
  const ABIs = [];

  try {
    const files = await fs.readdir(directory, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(directory, file.name);

      if (file.isDirectory()) {
        if (!excludeList.includes(file.name)) {
          try {
            const nestedFiles = await listABIs(fullPath, excludeList);
            ABIs.push(...nestedFiles);
          } catch (nestedError) {
            console.error(
              `Error reading directory ${fullPath}:`,
              nestedError.message
            );
          }
        }
      } else if (file.isFile() && file.name.endsWith(".json")) {
        try {
          const content = await fs.readFile(fullPath, "utf8");
          const abi = JSON.parse(content).abi;
          if (abi.length && !isInterface(file.name)) {
            ABIs.push({ fileName: file.name.slice(0, -5), abi: abi });
          }
        } catch (readError) {
          console.error(`Error reading file ${fullPath}:`, readError.message);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
    throw new Error(`Failed to list JSON files in directory ${directory}`);
  }

  return ABIs;
};

(async () => {
  try {
    const libs = await listSolFiles(path.join(currentPath, "/foundry/lib"));
    const out = await listABIs(path.join(currentPath, "/foundry/out"), libs);

    const write = await fs.writeFile(
      path.join(currentPath, "/data/localData.json"),
      JSON.stringify(out, null, 2)
    );

    console.log({ write });
    console.log(`Listed ${out.length} files: ${out.map((e) => e.fileName)}`);
  } catch (error) {
    throw error;
  }
})();
