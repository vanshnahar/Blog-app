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



// Function to change doctor for a patient
async function changeDoctor() {
  const contract = await initContractAndMetaMask();
  if (!contract) return;

  const patientID = document.getElementById("patientIDChange").value;
  const newDoctorAddress = document.getElementById("newDoctorAddress").value;

  try {
    const tx = await contract.changeDoctorForPatient(
      patientID,
      newDoctorAddress
    );
    await tx.wait(); // Wait for the transaction to be mined

    alert("Doctor changed successfully!");
  } catch (error) {
    console.error(error);
    alert("Error changing doctor: " + error.message);
  }
}
