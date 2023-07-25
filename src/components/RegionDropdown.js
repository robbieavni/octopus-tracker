import { Dropdown } from "flowbite-react"
import PostcodeLookup from "./PostcodeLookup"

export default function RegionDropdown({energyRegion, regionSelected, onRegionSelect, regions}) {
  return (
    <div className="col-span-2 flex">
      <Dropdown
        label={regionSelected ? energyRegion + " - " + regions[energyRegion] : "Energy Region"}
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
    </div>
  )
}