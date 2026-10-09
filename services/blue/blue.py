import os
import sys
import httpx

GATEWAY = os.getenv("GATEWAY_URL", "http://gateway:8000").rstrip("/")
TOKEN = os.getenv("BLUE_SHARED_TOKEN", "blue-demo-token")

def run_blue_suite():
    print("=" * 60)
    print("BAYORA BLUE TEAM DEFENSIVE VALIDATION SANDBOX")
    print(f"Gateway: {GATEWAY} | Auth: Capability Token [X-Bayora-Capability]")
    print("=" * 60)

    test_id = sys.argv[1] if len(sys.argv) > 1 else None
    
    if not test_id:
        # Fetch latest report from gateway to get active evaluation ID
        try:
            rep = httpx.get(f"{GATEWAY}/report", timeout=10).json()
            test_id = rep.get("evaluation_id")
        except Exception:
            pass

    if not test_id:
        raise SystemExit("[-] Usage: python blue.py EVALUATION_ID (or ensure an evaluation exists)")

    print(f"[*] Querying Sanitized Blue View for: {test_id}")
    try:
        r = httpx.get(
            f"{GATEWAY}/tests/{test_id}/blue-view",
            headers={"X-Bayora-Capability": TOKEN},
            timeout=10
        )
        data = r.json()
        print(f"[+] Total Attacks Tracked: {data.get('total_attacks')}")
        print(f"[+] Threats Detected: {data.get('threats_detected')}")
        print(f"[+] Active Defenses: {data.get('defenses_active')}")
        print(f"\n[*] Security Findings:")
        for f in data.get("findings", []):
            print(f"    - [{f.get('severity')}] {f.get('title')}: {f.get('description')}")
        
        print("\n[*] Sanitized Attack Feed (Confidential Payloads Redacted):")
        for atk in data.get("sanitized_attacks", [])[:5]:
            print(f"    - Attack {atk.get('id')}: Category={atk.get('category')} | Status={atk.get('result_class')} | PayloadHash={atk.get('payload_hash')[:12]}...")
            
    except Exception as e:
        print(f"[-] Blue view query error: {e}")

    print("\n" + "=" * 60)
    print("[✓] Blue Team sanitized validation completed.")
    print("=" * 60)

if __name__ == "__main__":
    run_blue_suite()
