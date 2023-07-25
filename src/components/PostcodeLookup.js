import { Modal, Label, TextInput, Button } from 'flowbite-react';
import help from '../help.svg';
import { useState } from 'react'
import { lookupRegion } from '../services/octopus-price';

export default function PostcodeLookup({onRegionSelect}) {
    const [openModal, setOpenModal] = useState("");
    const [postcode, setPostcode] = useState("");
    const [statusText, setStatusText] = useState("");
  
    const props = { openModal, setOpenModal, postcode, setPostcode };
  
    const handleChange = (event) => {
      setPostcode(event.target.value);
    }
  
    const parsePostcodeResult = (results) => {
      if (results.length) {
        let region = results[0].group_id.slice(-1);
        setStatusText("")
        props.setOpenModal(false);
        onRegionSelect(region);
      }
      else {
        setStatusText("Region not found. Please try again.");
      }
    }
    
    function handleSubmit() {
      setStatusText("Loading...")
      lookupRegion(postcode)
        .then(data => parsePostcodeResult(data.results))
    }
  
    return (
      <>
        <img className="h-6 w-6 ml-1 cursor-pointer" src={help} onClick={() => props.setOpenModal('form-elements')}></img>
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
              <div>
                <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{statusText}</p>
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