import { Accordion } from "flowbite-react"

export default function DescrptionAccordion() {
    return (
      <div className="col-span-2 py-6 px-3 bg-white rounded-xl shadow-lg">
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>
              What does this site show?
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                This site shows the Octopus Tracker rates for today and tomorrow in pence per kilowatt hour as well as the current Standard tariff rate for comparison. Rates are typically released about midday for the next day but may not be available until later.
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Select your energy region at the top or click the help button if you don't know.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Not already with Octopus Energy? Sign up here and receive a £50 credit: <a 
                    href="https://share.octopus.energy/lush-mule-604" 
                    className="font-bold text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      https://share.octopus.energy/lush-mule-604
                  </a>
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              What about standing charges?
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                The standing charge does not vary each day on the Tracker tariff and is comparable to the Standard tariff.
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                For example, the standing charges for region A on the Tracker tariff are 37.29p/day and 26.84p/day compared to 42.01p/day and 27.47p/day on the Standard tariff.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    )
  }
  