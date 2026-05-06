#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

if command -v sysctl >/dev/null 2>&1; then
	current_map_count="$(sysctl -n vm.max_map_count 2>/dev/null || echo 0)"
	if [[ "$current_map_count" -lt 262144 ]]; then
		echo "vm.max_map_count is $current_map_count; SonarQube needs at least 262144 on Linux."
		echo "Run: sudo sysctl -w vm.max_map_count=262144"
		exit 1
	fi
fi

docker compose up -d --build mariadb sonarqube-db sonarqube backend frontend

# Run backend tests and generate coverage
echo "Running backend tests..."
pushd "$BACKEND_DIR" >/dev/null
source .venv/bin/activate
pytest --cov=. --cov-report=xml --cov-report=term-missing -q
deactivate
popd >/dev/null

# Normalize coverage.xml sources to match the scanner's /usr/src layout
python3 - <<'PY'
import xml.etree.ElementTree as ET
from pathlib import Path

coverage_file = Path("backend") / "coverage.xml"
if coverage_file.exists():
		tree = ET.parse(coverage_file)
		root = tree.getroot()
		sources = root.find("sources")
		if sources is not None:
				for source in list(sources):
						sources.remove(source)
				new_source = ET.SubElement(sources, "source")
				new_source.text = "backend"
				tree.write(coverage_file, encoding="UTF-8", xml_declaration=True)
PY

# Run frontend tests
echo "Running frontend tests..."
pushd "$FRONTEND_DIR" >/dev/null
npm run test:coverage
popd >/dev/null

# Wait for SonarQube HTTP API to be ready (max ~2 minutes)
echo "Waiting for SonarQube to be ready at http://localhost:9000 ..."
ready=0
for i in {1..60}; do
	if curl -sSf http://localhost:9000/api/server/version >/dev/null 2>&1; then
		ready=1
		echo ""
		echo "✓ SonarQube is available"
		break
	fi
	echo -n "."
	sleep 2
done
if [ "$ready" -ne 1 ]; then
	echo ""
	echo "ERROR: SonarQube did not become ready in time. Check logs with: docker compose logs sonarqube"
	exit 1
fi

echo "Running SonarQube analysis..."
docker compose --profile analysis run --rm sonar-scanner
echo "✓ Analysis complete!"
