#!/usr/bin/env bash
set -euo pipefail

STEP=1

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "Error: python3/python not found in PATH."
  exit 1
fi

CLI=("$PYTHON_BIN" "se2525")
SOURCE_CSV="../back-end/data/points.csv"

# Generate timestamps exactly as requested:
# every S is current time, every E is current time + 40m
readarray -t TIME_VALUES < <("$PYTHON_BIN" - <<'PY'
from datetime import datetime, timedelta

now = datetime.now().replace(second=0, microsecond=0)
s1 = now
e1 = now + timedelta(minutes=40)
s2 = now
e2 = now + timedelta(minutes=40)

def fmt(dt):
    return dt.strftime("%Y-%m-%d %H:%M")

print(fmt(s1))
print(fmt(e1))
print(fmt(s2))
print(fmt(e2))
print(now.strftime("%Y%m%d"))
PY
)

# On Windows Python, readarray may keep trailing '\r'. Strip it.
for i in "${!TIME_VALUES[@]}"; do
  TIME_VALUES[$i]="${TIME_VALUES[$i]%$'\r'}"
done

S1="${TIME_VALUES[0]}"
E1="${TIME_VALUES[1]}"
S2="${TIME_VALUES[2]}"
E2="${TIME_VALUES[3]}"

# All range queries: from 20250101 to current day
FROM_DAY="20250101"
TO_DAY="${TIME_VALUES[4]}"

pause_step() {
  read -n 1 -s -r -p "Press any key to continue..."
  echo
}

run_step() {
  local label="$1"
  shift

  echo
  echo "[$STEP] $label"
  echo "Command: $*"
  pause_step

  "$@"
  STEP=$((STEP + 1))
}

if [[ ! -f "$SOURCE_CSV" ]]; then
  echo "Error: CSV file not found at $SOURCE_CSV"
  exit 1
fi

read -r -p "Enter point id X to use in all steps: " X
if [[ ! "$X" =~ ^[0-9]+$ ]] || [[ "$X" -le 0 ]]; then
  echo "Error: X must be a positive integer."
  exit 1
fi

echo "Using X=$X"
echo "S1=$S1, E1=$E1, S2=$S2, E2=$E2"
echo "Date window for sessions/pointstatus: from=$FROM_DAY to=$TO_DAY"

echo
pause_step

run_step "healthcheck" "${CLI[@]}" healthcheck
run_step "resetpoints" "${CLI[@]}" resetpoints
run_step "addpoints" "${CLI[@]}" addpoints --source "$SOURCE_CSV"
run_step "healthcheck" "${CLI[@]}" healthcheck

run_step "points --status available" "${CLI[@]}" points --status available
run_step "points --status charging" "${CLI[@]}" points --status charging
run_step "points --status offline" "${CLI[@]}" points --status offline

run_step "point --id X" "${CLI[@]}" point --id "$X"
run_step "reserve --id X" "${CLI[@]}" reserve --id "$X"
run_step "points --status reserved" "${CLI[@]}" points --status reserved

run_step "point --id X" "${CLI[@]}" point --id "$X"
run_step "updpoint --id X --status available" "${CLI[@]}" updpoint --id "$X" --status available
run_step "point --id X" "${CLI[@]}" point --id "$X"

run_step "reserve --id X" "${CLI[@]}" reserve --id "$X"
run_step "points --status reserved" "${CLI[@]}" points --status reserved

run_step "newsession #1" "${CLI[@]}" newsession --id "$X" --starttime "$S1" --endtime "$E1" --startsoc 10 --endsoc 30 --totalkwh 15 --kwhprice 0.5 --amount 7.5
run_step "pointstatus --id X --from 20250101 --to current" "${CLI[@]}" pointstatus --id "$X" --from "$FROM_DAY" --to "$TO_DAY"
run_step "point --id X" "${CLI[@]}" point --id "$X"

run_step "newsession #2" "${CLI[@]}" newsession --id "$X" --starttime "$S2" --endtime "$E2" --startsoc 50 --endsoc 80 --totalkwh 20 --kwhprice 0.6 --amount 12
run_step "sessions --id X --from 20250101 --to current" "${CLI[@]}" sessions --id "$X" --from "$FROM_DAY" --to "$TO_DAY"
run_step "pointstatus --id X --from 20250101 --to current" "${CLI[@]}" pointstatus --id "$X" --from "$FROM_DAY" --to "$TO_DAY"

echo
echo "Demo sequence completed."
