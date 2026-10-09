# Bayora 5-Minute Demo

1. `docker compose up --build`
2. `curl -X POST http://localhost:8080/tests`
3. Use the returned ID to submit a Red attack through `/red/attack`.
4. Show the response is blocked.
5. Query `/blue-view` with the Blue capability. The raw attack is not present.
6. Query `/report` and show the hash-chain evidence tip.
7. Run `/contamination-check` and show `present: false`.

Judge message:
"The target being safe is only half the problem. Bayora proves the test
itself remained isolated, auditable and clean."
