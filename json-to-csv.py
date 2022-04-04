import json
import csv
import argparse

parser = argparse.ArgumentParser()
parser.add_argument(
    '--json-file', help=('path to JSON file containing the pasted roles_map JSON object'), required=True, nargs=1)
args = parser.parse_args()
json_file = args.json_file[0]
csv_file_name = f'{json_file.lower().replace("json","csv")}'
data = None
with open(json_file, 'r') as f:
    # get name, reproduce with CSV extension instead of json
    data = json.load(f)

if data:
    data = dict(data)
    profiles = ["Authenticated", "Unauthenticated"]
    csv_tile_rows = []
    csv_fields = ['Tile', 'Roles', 'Tag']
    for key, value in data.items():
        tag = value['Tag']
        # format each role as profile:role, profile:role
        # e.g., Authenticated:Role_Student, Unauthenticated:Default, ...
        roles = []
        for p in profiles:
            if p in value:
                roles.extend(map(lambda x: f'{p}:{x}', value[p]))
                print(roles)
        csv_tile_rows.append(
            {'Tile': key, 'Roles': '+'.join(roles), 'Tag': value['Tag']}
        )

    with open(csv_file_name, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields)
        writer.writeheader()
        writer.writerows(csv_tile_rows)
