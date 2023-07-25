import './App.css';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import DescrptionAccordion from './components/DescriptionAccordion';
import EnergyPrices from './components/EnergyPrices';
import RegionDropdown from './components/RegionDropdown';

const regions = {
  "A": "Eastern England",
  "B": "East Midlands",
  "C": "London",
  "D": "Merseyside and Northern Wales",
  "E": "West Midlands",
  "F": "North Eastern England",
  "G": "North Western England",
  "H": "Southern England",
  "J": "South Eastern England",
  "K": "Southern Wales",
  "L": "South Western England",
  "M": "Yorkshire",
  "N": "Southern Scotland",
  "P": "Northern Scotland",
}

export default function App() {
  const [cookies, setCookie] = useCookies(['selected-region']);
  const [energyRegion, setEnergyRegion] = useState((cookies["selected-region"]? cookies["selected-region"] : "A"));
  const [regionSelected, setRegionSelected] = useState(cookies["selected-region"] ? true : false);

  const onRegionSelect = regionSelected => {
    setEnergyRegion(regionSelected);
    setRegionSelected(true);
    setCookie("selected-region", regionSelected, { path: "/", maxAge: 2592000});
  }

  return (
    <div className="grid justify-items-stretch gap-4 grid-cols-2 max-w-screen-lg mx-auto">
      <RegionDropdown 
        energyRegion={cookies["selected-region"] ? cookies['selected-region'] : energyRegion}
        regionSelected={regionSelected}
        onRegionSelect={onRegionSelect}
        regions={regions}
      />
      <EnergyPrices 
        energyRegion={cookies["selected-region"] ? cookies['selected-region'] : energyRegion}
      />
      <DescrptionAccordion />
    </div>
  );
}
