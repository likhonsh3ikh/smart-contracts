document.addEventListener('DOMContentLoaded', () => {
    const contractList = document.getElementById('contract-list');
    const networkLinks = document.querySelectorAll('#networks a');

    networkLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const network = e.target.dataset.network;
            fetchContracts(network);
        });
    });

    function fetchContracts(network) {
        // In a real-world scenario, this would be an API call
        // For demonstration, we'll use dummy data
        const dummyContracts = [
            { name: 'Token1', address: '0x1234...', type: 'ERC20' },
            { name: 'Token2', address: '0x5678...', type: 'ERC721' },
            { name: 'Token3', address: '0x9abc...', type: 'ERC1155' },
        ];

        displayContracts(dummyContracts);
    }

    function displayContracts(contracts) {
        contractList.innerHTML = '';
        contracts.forEach(contract => {
            const card = document.createElement('div');
            card.className = 'contract-card';
            card.innerHTML = `
                <h3>${contract.name}</h3>
                <p>Address: ${contract.address}</p>
                <p>Type: ${contract.type}</p>
            `;
            contractList.appendChild(card);
        });
    }
});

