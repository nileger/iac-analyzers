import yamale
schema = yamale.make_schema('./schema.yml')

from pathlib import Path
sica = list(Path("../sicas/").rglob("*.yml"))

for s in sica:
    # Create a Data object
    data = yamale.make_data(s)

    # Validate data against the schema. Throws a ValueError if data is invalid.
    yamale.validate(schema, data)