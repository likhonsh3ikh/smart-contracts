document.addEventListener('DOMContentLoaded', () => {
    const contractList = document.getElementById('contract-list');
    const networkButtons = document.querySelectorAll('.network-btn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    let currentNetwork = 'ethereum';

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    networkButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentNetwork = e.target.dataset.network;
            fetchContracts(currentNetwork);
            updateNetworkStats();
        });
    });

    async function fetchContracts(network) {
        try {
            const response = await fetch(`/api/contracts?network=${network}`);
            const contracts = await response.json();
            displayContracts(contracts);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
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
                <a href="#" onclick="showContractDetails('${contract.address}')">View Details</a>
            `;
            contractList.appendChild(card);
        });
    }

    function showContractDetails(address) {
        // Implement a modal or navigate to a new page to show contract details
        console.log(`Showing details for contract: ${address}`);
    }

    function updateNetworkStats() {
        const ctx = document.getElementById('networkStats').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ethereum', 'BSC', 'Polygon'],
                datasets: [{
                    label: '# of Contracts',
                    data: [12, 19, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initial load
    fetchContracts(currentNetwork);
    updateNetworkStats();
});

