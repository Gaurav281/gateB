export const logInfo = (message) => {
  console.log(`ℹ️  ${message}`);
};

export const logError = (message, error = null) => {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(error);
  }
};
