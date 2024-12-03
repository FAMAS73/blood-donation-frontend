// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BloodDonation {
    struct Donor {
        string name;
        uint donorId;
        uint timestamp;
        string bloodType;
        uint weight;
        uint height;
        uint age;
        string nationalId;
        bool hasDisease;
        bool isEligible;
        uint lastDonation;
        bool isRegistered;
    }

    struct BloodUnit {
        uint donorId;
        uint timestamp;
        string bloodType;
        uint quantity;
        string component;
        uint expiryDate;
        string storageTemp;
        string location;
        bool isScreened;
        bool isUsed;
        string hospital;
    }

    // State Variables
    mapping(address => Donor) public donors;
    mapping(uint => BloodUnit) public bloodUnits;
    mapping(string => uint[]) private withdrawnBloodByHospital; // Tracks blood units withdrawn by hospital
    uint public totalDonors;
    uint public totalBloodUnits;

    // Compatibility Rules
    mapping(string => string[]) private bloodCompatibility;

    // Constants
    uint constant MIN_DONOR_AGE = 17;
    uint constant MAX_DONOR_AGE = 70;
    uint constant MIN_WEIGHT = 45;
    uint constant WHOLE_BLOOD_VOLUME = 450;

    // Events
    event BloodWithdrawn(uint indexed unitId, string hospital, uint timestamp);
    event WithdrawnUnitsUpdated(string hospital, uint totalUnits);

    constructor() {
        // Define blood compatibility rules
        bloodCompatibility["O-"] = ["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"];
        bloodCompatibility["O+"] = ["O+", "A+", "B+", "AB+"];
        bloodCompatibility["A-"] = ["A-", "AB-", "A+", "AB+"];
        bloodCompatibility["A+"] = ["A+", "AB+"];
        bloodCompatibility["B-"] = ["B-", "AB-", "B+", "AB+"];
        bloodCompatibility["B+"] = ["B+", "AB+"];
        bloodCompatibility["AB-"] = ["AB-", "AB+"];
        bloodCompatibility["AB+"] = ["AB+"];
    }

    // Register Donor
    function registerDonor(
        string memory _name,
        string memory _bloodType,
        uint _weight,
        uint _height,
        uint _age,
        string memory _nationalId,
        bool _hasDisease
    ) public {
        require(!donors[msg.sender].isRegistered, "Donor already registered");
        require(_age >= MIN_DONOR_AGE && _age <= MAX_DONOR_AGE, "Age not within acceptable range");
        require(_weight >= MIN_WEIGHT, "Weight below minimum requirement");
        require(!_hasDisease, "Cannot register with existing diseases");

        totalDonors++;
        donors[msg.sender] = Donor({
            name: _name,
            donorId: totalDonors,
            timestamp: block.timestamp,
            bloodType: _bloodType,
            weight: _weight,
            height: _height,
            age: _age,
            nationalId: _nationalId,
            hasDisease: _hasDisease,
            isEligible: true,
            lastDonation: 0,
            isRegistered: true
        });
    }

    // Donate Blood
    function donateBlood(string memory _component) public {
        require(donors[msg.sender].isRegistered, "Donor not registered");

        totalBloodUnits++;
        bloodUnits[totalBloodUnits] = BloodUnit({
            donorId: donors[msg.sender].donorId,
            timestamp: block.timestamp,
            bloodType: donors[msg.sender].bloodType,
            quantity: WHOLE_BLOOD_VOLUME,
            component: _component,
            expiryDate: block.timestamp + 30 days,
            storageTemp: "2-6C",
            location: "Blood Bank Storage",
            isScreened: true,
            isUsed: false,
            hospital: ""
        });
    }

    // Withdraw Blood Based on Compatibility
    function withdrawCompatibleBloodUnits(
        string memory _recipientBloodType,
        string memory _component,
        uint _quantity,
        string memory _hospital
    ) public {
        uint withdrawn = 0;

        for (uint i = 1; i <= totalBloodUnits; i++) {
            BloodUnit storage unit = bloodUnits[i];

            // Check compatibility and availability
            if (
                !unit.isUsed &&
                unit.isScreened &&
                keccak256(bytes(unit.component)) == keccak256(bytes(_component)) &&
                isCompatible(unit.bloodType, _recipientBloodType)
            ) {
                unit.isUsed = true;
                unit.hospital = _hospital;
                withdrawn += unit.quantity;

                // Track withdrawn units
                withdrawnBloodByHospital[_hospital].push(i);

                emit BloodWithdrawn(i, _hospital, block.timestamp);

                if (withdrawn >= _quantity) break;
            }
        }

        require(withdrawn >= _quantity, "Not enough compatible blood units available");
        emit WithdrawnUnitsUpdated(_hospital, withdrawnBloodByHospital[_hospital].length);
    }

    // Check Blood Compatibility
    function isCompatible(string memory donorType, string memory recipientType) private view returns (bool) {
        string[] memory compatibleTypes = bloodCompatibility[donorType];
        for (uint i = 0; i < compatibleTypes.length; i++) {
            if (keccak256(bytes(compatibleTypes[i])) == keccak256(bytes(recipientType))) {
                return true;
            }
        }
        return false;
    }

    // Get Blood Withdrawn by Hospital
    function getWithdrawnBloodByHospital(string memory _hospital) public view returns (uint[] memory) {
        return withdrawnBloodByHospital[_hospital];
    }

    // Get Blood Unit Information
    function getBloodUnit(uint _unitId) public view returns (
        uint donorId,
        string memory bloodType,
        uint quantity,
        string memory component,
        uint expiryDate,
        bool isScreened,
        bool isUsed,
        string memory hospital
    ) {
        BloodUnit memory unit = bloodUnits[_unitId];
        return (
            unit.donorId,
            unit.bloodType,
            unit.quantity,
            unit.component,
            unit.expiryDate,
            unit.isScreened,
            unit.isUsed,
            unit.hospital
        );
    }
}
