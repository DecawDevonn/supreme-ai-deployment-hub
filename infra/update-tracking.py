import yaml
from datetime import datetime

TRACK_FILE = "devonn-infra-tracking.yml"

def update_last_run():
    with open(TRACK_FILE, "r") as f:
        data = yaml.safe_load(f)
    data["infra_tracking"]["last_update"] = datetime.utcnow().isoformat() + "Z"
    with open(TRACK_FILE, "w") as f:
        yaml.safe_dump(data, f)
    print(f"Updated {TRACK_FILE} timestamp to UTC {data['infra_tracking']['last_update']}")

if __name__ == "__main__":
    update_last_run()
