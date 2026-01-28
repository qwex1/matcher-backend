import { parseOfficeAsync } from "officeparser";

export const parseFile = async (file) => {
  try {
    const parsed = await parseOfficeAsync(file);
    const result = parsed.split('\n***\n')
    return result;
  } catch (error) {
    console.error("Error parsing file:", error);
    throw error;
  }
};
