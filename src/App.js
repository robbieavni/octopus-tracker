import bolt from './bolt.svg';
import flame from './flame.svg';
import help from './help.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react'
import { 
  Dropdown,
  Button,
  Label, 
  Modal, 
  TextInput
} from 'flowbite-react';
import { useCookies } from 'react-cookie'
import {
  getElectricityData,
  getGasData,
  getStandardElectricityData,
  getStandardGasData,
  lookupRegion
} from "./services/octopus-price";

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

function PostcodeLookup({onRegionSelect}) {
  const [openModal, setOpenModal] = useState("");
  const [postcode, setPostcode] = useState("");
  const props = { openModal, setOpenModal, postcode, setPostcode };

  const handleChange = (event) => {
    setPostcode(event.target.value);
  }

  const parsePostcodeResult = (results) => {
    if (results.length) {
      let region = results[0].group_id.slice(-1);
      onRegionSelect(region);
      console.log(region);
    }
    else {
      console.log("region not found")
    }
  }
  
  function handleSubmit() {
    lookupRegion(postcode)
      .then(data => parsePostcodeResult(data.results))
    props.setOpenModal(false);
  }

  return (
    <>
      <img class="h-6 w-6 ml-1" src={help} onClick={() => props.setOpenModal('form-elements')}></img>
      <Modal show={props.openModal === 'form-elements'} size="md" popup onClose={() => props.setOpenModal(undefined)} onSubmit={(handleSubmit)}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Enter your postcode to find your region</h3>
            <div>
              <div className="mb-2 block">
                <Label value="Your postcode" />
              </div>
              <TextInput htmlFor="postode" id="postcode" placeholder="WD19 4RT" required onChange={handleChange}/>
            </div>
            <div className="w-full">
              <Button onClick={() => handleSubmit()}>Find Region</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

function RegionDropdown({dropdownLabel, onRegionSelect}) {

  return (
    <div class="col-span-2 flex">
      <Dropdown
        label={dropdownLabel}
        placement="bottom-start"
      >
        {
          Object.keys(regions).map((oneKey, i) => {
            return (
              <Dropdown.Item key={oneKey} onClick={() => onRegionSelect(oneKey)}>
                {oneKey} - {regions[oneKey]}
              </Dropdown.Item>
            )
          })
        }
      </Dropdown>
      <PostcodeLookup onRegionSelect={onRegionSelect}/>
      {/* <img class="h-6 w-6 ml-1" src={help} alt="Tooltip"></img> */}
    </div>
  )
}

function Price({ price, description, icon }) {
  return (
    <div class="p-6 bg-white rounded-xl shadow-lg flex items-center justify-center space-x-4">
      <div class="shrink-0">
        <img class="h-14 w-14" src={icon} alt="Energy Symbol"></img>
      </div>
      <div>
        <div class="text-xl font-medium text-black text-center">{description}</div>
        <p class="text-slate-500 font-bold text-center">{price}</p>
      </div>
    </div>
  );
}

function App() {
  const [energyRegion, setEnergyRegion] = useState("A");

  const [todayElec, setTodayElec] = useState("Loading...");
  const [tomorrowElec, setTomorrowElec] = useState("Loading...");
  const [baselineElec, setBaselineElec] = useState("Loading...");

  const [todayGas, setTodayGas] = useState("Loading...");
  const [tomorrowGas, setTomorrowGas] = useState("Loading...");
  const [baselineGas, setBaselineGas] = useState("Loading...");

  const [cookies, setCookie, removeCookie] = useCookies(['selected-region']);

  const dataFetchedRef = useRef(false);
  const currentDateRef = useRef(null);

  const parseStandardResults = (results, elec) => {
    let newestStartDate = new Date(results[0].valid_from);
    let price;

    if (newestStartDate > currentDateRef.current) {
      price = results[1].value_inc_vat.toFixed(2)+'p';
    }
    else {
      price = results[0].value_inc_vat.toFixed(2)+'p';
    }

    elec ? setBaselineElec(price) : setBaselineGas(price);
  }

  const parseTrackerResults = (results, elec) => {
    let newestStartDate = new Date(results[0].valid_from);
    let today = ""
    let tomorrow = ""

    if (newestStartDate > currentDateRef.current) {
      today = results[1].value_inc_vat.toFixed(2)+'p';
      tomorrow = results[0].value_inc_vat.toFixed(2)+'p';
    }
    else {
      today = results[0].value_inc_vat.toFixed(2)+'p';
      tomorrow = "Price not yet available"
    }

    if (elec) {
      setTomorrowElec(tomorrow);
      setTodayElec(today);
    }
    else {
      setTomorrowGas(tomorrow);
      setTodayGas(today);
    }
  }

  const setToLoading = () => {
    setTodayElec("Loading...");
    setTomorrowElec("Loading...");
    setTodayGas("Loading...");
    setTomorrowGas("Loading...");
  }

  const fetchAndParseAllData = region => {
    getElectricityData(region)
      .then(data => parseTrackerResults(data.results, true))
    
    getGasData(region)
      .then(data => parseTrackerResults(data.results, false))

    getStandardElectricityData(region)
      .then(data => parseStandardResults(data.results, true))

    getStandardGasData(region)
      .then(data => parseStandardResults(data.results, false))
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    currentDateRef.current = new Date();

    if ("selected-region" in cookies) {
      setEnergyRegion(cookies["selected-region"]);
      fetchAndParseAllData(cookies["selected-region"]);
    }
    else {
      fetchAndParseAllData(energyRegion);
    }  
  }, []);

  const onRegionSelect = regionSelected => {
    setEnergyRegion(regionSelected);
    setCookie("selected-region", regionSelected, { path: "/" });
    setToLoading();
    fetchAndParseAllData(regionSelected);
  }

  return (
    <div>
      <div class="grid justify-items-stretch gap-4 grid-cols-2 max-w-screen-lg mx-auto">
        <RegionDropdown 
          dropdownLabel={("selected-region" in cookies) ? cookies["selected-region"] + " - " + regions[cookies["selected-region"]]: "Energy Region"} 
          onRegionSelect={onRegionSelect}
        />
        <Price price={todayElec} description={"Today's Electricity"} icon={bolt}/>
        <Price price={todayGas} description={"Today's Gas"} icon={flame}/>
        <Price price={tomorrowElec} description={"Tomorrow's Electricity"} icon={bolt}/>
        <Price price={tomorrowGas} description={"Tomorrow's Gas"} icon={flame}/>
        <Price price={baselineElec} description={"Standard Rate Elec"} icon={bolt}/>
        <Price price={baselineGas} description={"Standard Rate Gas"} icon={flame}/>
      </div>
    </div>
  );
}

export default App;
