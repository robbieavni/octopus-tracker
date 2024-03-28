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
    
    function findDirectDebitEntry(results) {
      const result = results.find(entry => {
        if (entry.payment_method !== "DIRECT_DEBIT") {
          return false;
        }
        const validFrom = new Date(entry.valid_from);
        const validTo = entry.valid_to ? new Date(entry.valid_to) : new Date("9999-12-31T23:59:59Z"); // Assuming a far future date if valid_to is null
        return currentDateRef.current >= validFrom && currentDateRef.current <= validTo;
      });
      return result;
    }
    let relevantEntry = findDirectDebitEntry(results)
    let price = relevantEntry.value_inc_vat.toFixed(2)+'p';

    elec ? setBaselineElec(price) : setBaselineGas(price);
  }

  const parseTrackerResults = (results, elec) => {
    function findEntriesForTodayAndTomorrow(results) {
      const today = currentDateRef.current;
      today.setHours(0, 0, 0, 0); // Normalize today's date to start of the day
    
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
    
      const todayString = today.toISOString().split('T')[0];
      const tomorrowString = tomorrow.toISOString().split('T')[0];
    
      const todayEntry = results.find(entry => entry.valid_from.startsWith(todayString));
      const tomorrowEntry = results.find(entry => entry.valid_from.startsWith(tomorrowString));
    
      return { todayEntry, tomorrowEntry };
    }
    
    const { todayEntry, tomorrowEntry } = findEntriesForTodayAndTomorrow(results);

    let today = todayEntry.value_inc_vat.toFixed(2)+'p';
    let tomorrow;
    if (tomorrowEntry !== undefined) {
      tomorrow = tomorrowEntry.value_inc_vat.toFixed(2)+'p';
    }
    else {
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