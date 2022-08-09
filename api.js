export const fetchVehicleData = async vrm => {
	let url =
		'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'x-api-key': 'V2G2u5xe6e5COVCIggSeq4Gnb2V78GRR1rdJLgn4',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			registrationNumber: vrm,
		}),
	});
	let json = await response.json();

	return json;
};
