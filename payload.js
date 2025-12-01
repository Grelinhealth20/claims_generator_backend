const  getAllClaimsSubmissions = {
    sizePerPage: 10,
    page: 1,
    clientId: "336"
  };
const getFilteredClaimsSubmissions = {
    sizePerPage: 10,
    page: 1,
    clientId: "653",
    status: "Billed",
    patientName: "David M",
    payerName: "Aetna",
    billedDate: "2025-11-05 00:00:00.000 +00:00",
    dateOfService: "2025-11-05",
    providerName:"fahad",
    facilityName:"vani"

  };
  const payload=btoa(JSON.stringify(getFilteredClaimsSubmissions));
  console.log(payload);