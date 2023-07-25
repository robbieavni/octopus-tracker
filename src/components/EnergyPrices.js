import bolt from '../bolt.svg'
import flame from '../flame.svg'
import Price from './Price';
import { useState, useEffect, useRef } from 'react'
import {
  getElectricityData,
  getGasData,
  getStandardElectricityData,
  getStandardGasData,
} from "../services/octopus-price";

export default function EnergyPrices({energyRegion}) {
  const [todayElec, setTodayElec] = useState("Loading...");
  const [tomorrowElec, setTomorrowElec] = useState("Loading...");
  const [baselineElec, setBaselineElec] = useState("Loading...");

  const [todayGas, setTodayGas] = useState("Loading...");
  const [tomorrowGas, setTomorrowGas] = useState("Loading...");
  const [baselineGas, setBaselineGas] = useState("Loading...");

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
    setToLoading();

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
    currentDateRef.current = new Date();
    if (energyRegion) fetchAndParseAllData(energyRegion);
    else fetchAndParseAllData("A");
  }, [energyRegion]);

  return (
    <>
        <Price price={todayElec} description={"Today"} icon={bolt}/>
        <Price price={todayGas} description={"Today"} icon={flame}/>
        <Price price={tomorrowElec} description={"Tomorrow"} icon={bolt}/>
        <Price price={tomorrowGas} description={"Tomorrow"} icon={flame}/>
        <Price price={baselineElec} description={"Standard Rate"} icon={bolt}/>
        <Price price={baselineGas} description={"Standard Rate"} icon={flame}/>
    </>
  );
}