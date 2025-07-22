export const SoftwareConfigParser = (() => {
  let softwareName: string;
  let softwareVersion: string;
  const loadSoftwareName = (): void => {
    if (!process.env.SOFTWARE_NAME) {
      throw new Error(
        `SOFTWARE_NAME is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    softwareName = process.env.SOFTWARE_NAME;
  };
  const getSoftwareName = () => {
    if (!softwareName) {
      loadSoftwareName();
    }

    return softwareName;
  };
  const loadSoftwareVersion = (): void => {
    if (!process.env.SOFTWARE_VERSION) {
      throw new Error(
        `SOFTWARE_VERSION is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    softwareVersion = process.env.SOFTWARE_VERSION;
  };
  const getSoftwareVersion = () => {
    if (!softwareVersion) {
      loadSoftwareVersion();
    }

    return softwareVersion;
  };
  try {
    loadSoftwareName();
  } catch (error) {
    console.error(error);
  }
  try {
    loadSoftwareVersion();
  } catch (error) {
    console.error(error);
  }

  return {
    getSoftwareName,
    getSoftwareVersion,
  };
})();
