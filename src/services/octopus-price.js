const basePath = "https://api.octopus.energy/v1";

const electricityTrackerPath = "/products/SILVER-23-12-06/electricity-tariffs/E-1R-SILVER-23-12-06-";
const gasTrackerPath = "/products/SILVER-23-12-06/gas-tariffs/G-1R-SILVER-23-12-06-"
const electricityStandardPath = "/products/VAR-22-11-01/electricity-tariffs/E-1R-VAR-22-11-01-";
const gasStandardPath = "/products/VAR-22-11-01/gas-tariffs/G-1R-VAR-22-11-01-"

const regionLookupPath = "/industry/grid-supply-points/?postcode="

const ratesPath = "/standard-unit-rates/"

const buildTariffPath = (energyRegion, tariffPath) => {
    return basePath + tariffPath + energyRegion + ratesPath;
};

const buildRegionLookupPath = (postcode) => {
    return basePath + regionLookupPath + postcode;
}

export const getElectricityData = (energyRegion) =>
    fetch(buildTariffPath(energyRegion, electricityTrackerPath))
        .then((data) => data.json()
    );

export const getGasData = (energyRegion) =>
    fetch(buildTariffPath(energyRegion, gasTrackerPath))
        .then((data) => data.json()
    );

export const getStandardElectricityData = (energyRegion) =>
    fetch(buildTariffPath(energyRegion, electricityStandardPath))
        .then((data) => data.json()
    );

export const getStandardGasData = (energyRegion) =>
    fetch(buildTariffPath(energyRegion, gasStandardPath))
        .then((data) => data.json()
    );

export const lookupRegion = (postcode) =>
    fetch(buildRegionLookupPath(postcode))
        .then((data) => data.json()
    );