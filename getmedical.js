async function fetchContractABI() {
  const response = await fetch("contractABI.json"); // Make sure the ABI JSON file is in the same directory
  const data = await response.json();
  return data.abi; // Return only the ABI array
}

// Function to initialize the contract, MetaMask, and fetch contract ABI
async function initContractAndMetaMask() {
  if (!window.ethereum) {
    alert(
      "MetaMask is not installed. Please install MetaMask to interact with this website."
    );
    return null;
  }

  try {
    // Request permission to access user's MetaMask accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x2344B19323926B555f6A88293364056FF90CeC32"; // Replace with your actual contract address
    const contractABI = await fetchContractABI();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    return contract;
  } catch (error) {
    console.error(error);
    alert("Error initializing contract and MetaMask: " + error.message);
    return null;
  }
}
async function getRecords() {
  const contract = await initContractAndMetaMask();
  if (!contract) return;

  const patientID = document.getElementById("patientIDGet").value;

  try {
    const records = await contract.getRecords(patientID);
    let formattedInfo = "";

    // Loop through each record and format the information
    records.forEach((record) => {
      formattedInfo += `
                patientID: ${record.patientID} <br>
              
                Timestamp: ${new Date(record.timestamp * 1000)} <br>
                Age: ${record.age} <br>
                Gender: ${record.gender} <br>
                Diagnosis: ${record.diagnosis} <br>
                <br>
            `;
    });

    // Ensure the element exists before trying to set its innerHTML
    const recordsElement = document.getElementById("medicalRecords");
    if (recordsElement) {
      recordsElement.innerHTML = formattedInfo;
    } else {
      console.error("Element with ID 'medicalRecords' not found.");
    }
    console.log("Fetched records:", records);
  } catch (error) {
    console.error(error);
    alert("Error fetching records: " + error.message);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("button[onclick='getRecords()']")
    .addEventListener("click", getRecords);
});
