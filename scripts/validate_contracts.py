import os
import yaml
import jsonschema
from pathlib import Path

def load_schema(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def validate_contract(contract, schema):
    try:
        jsonschema.validate(instance=contract, schema=schema)
        return True
    except jsonschema.exceptions.ValidationError as e:
        print(f"Validation error: {e}")
        return False

def main():
    schema = load_schema('schema/contract_schema.yml')
    contracts_dir = Path('contracts')

    for network_dir in contracts_dir.iterdir():
        if network_dir.is_dir():
            for contract_file in network_dir.glob('**/*.json'):
                with open(contract_file, 'r') as file:
                    contract = yaml.safe_load(file)
                
                if validate_contract(contract, schema):
                    print(f"Valid contract: {contract_file}")
                else:
                    print(f"Invalid contract: {contract_file}")

if __name__ == "__main__":
    main()

