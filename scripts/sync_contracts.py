import os
import yaml
import requests
from pathlib import Path
from web3 import Web3
from eth_abi import decode_abi

def load_config(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def fetch_contracts(network, api_url, api_key):
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.get(f"{api_url}/api?module=contract&action=getsourcecode&apikey={api_key}", headers=headers)
    if response.status_code == 200:
        return response.json()['result']
    else:
        print(f"Error fetching contracts for {network}: {response.status_code}")
        return []

def check_honeypot(address, network):
    w3 = Web3(Web3.HTTPProvider(f"https://{network}.infura.io/v3/YOUR_INFURA_PROJECT_ID"))
    
    # Check if the contract has a transfer function
    contract = w3.eth.contract(address=address, abi=[])
    try:
        contract.functions.transfer().call()
    except:
        return False
    
    # Check if the contract has a high gas fee
    gas_price = w3.eth.gas_price
    if gas_price > 100000000000:  # 100 Gwei
        return True
    
    return False

def validate_contract(contract):
    required_fields = ['name', 'address', 'abi']
    return all(field in contract for field in required_fields)

def save_contract(contract, network):
    network_dir = Path(f"contracts/{network}/tokens")
    network_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = network_dir / f"{contract['name']}.json"
    with open(file_path, 'w') as file:
        yaml.dump(contract, file)

def main():
    networks = load_config('config/networks.yml')
    
    for network, config in networks.items():
        print(f"Syncing contracts for {network}...")
        contracts = fetch_contracts(network, config['api_url'], config['api_key'])
        
        for contract in contracts:
            if validate_contract(contract):
                if not check_honeypot(contract['address'], network):
                    save_contract(contract, network)
                    print(f"Saved contract: {contract['name']}")
                else:
                    print(f"Potential honeypot detected: {contract['name']}")
            else:
                print(f"Invalid contract data: {contract['name']}")

if __name__ == "__main__":
    main()

