import re
import time
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.models import Defense
import logging

logger = logging.getLogger("bayora.policy_engine")

class PolicyEngine:
    @staticmethod
    def evaluate_prompt(
        db: Session,
        evaluation_id: str,
        prompt: str
    ) -> Tuple[bool, str, str, str, float]:
        """
        Evaluates input prompt against active Blue Team defense rules.
        Returns: (is_blocked, action, matched_rule_name, processed_prompt, latency_ms)
        """
        start = time.perf_counter()
        
        # Load active defenses for this evaluation
        active_defenses = (
            db.query(Defense)
            .filter(
                Defense.evaluation_id == evaluation_id,
                Defense.is_active == True
            )
            .all()
        )

        p_lower = prompt.lower()
        processed_prompt = prompt

        for defense in active_defenses:
            pattern = defense.pattern.lower()
            matched = False

            if defense.rule_type == "keyword_filter":
                if pattern in p_lower:
                    matched = True
            elif defense.rule_type == "regex_guard":
                try:
                    if re.search(defense.pattern, prompt, re.IGNORECASE):
                        matched = True
                except re.error:
                    if pattern in p_lower:
                        matched = True
            elif defense.rule_type == "instruction_fence":
                if any(x in p_lower for x in ["ignore previous", "override system", "disregard instructions"]):
                    matched = True
            elif defense.rule_type == "canary_trap":
                if "bayora-" in p_lower or "canary" in p_lower:
                    matched = True

            if matched:
                latency = round((time.perf_counter() - start) * 1000, 2)
                if defense.action == "BLOCK":
                    return True, "BLOCK", defense.name, "Request blocked by Bayora Policy Engine: active defensive rule violation.", latency
                elif defense.action == "REDACT":
                    # Redact matched text
                    processed_prompt = re.sub(re.escape(defense.pattern), "[REDACTED_BY_BLUE_DEFENSE]", processed_prompt, flags=re.IGNORECASE)
                    return False, "REDACT", defense.name, processed_prompt, latency
                elif defense.action == "QUARANTINE":
                    return True, "QUARANTINE", defense.name, "Request quarantined for human security review.", latency

        latency = round((time.perf_counter() - start) * 1000, 2)
        return False, "ALLOW", "default_allow", processed_prompt, latency

    @staticmethod
    def test_single_defense(rule_type: str, pattern: str, action: str, test_input: str) -> Dict[str, Any]:
        start = time.perf_counter()
        matched = False
        p_lower = test_input.lower()
        pat_lower = pattern.lower()
        sanitized = test_input

        if rule_type == "keyword_filter":
            matched = pat_lower in p_lower
        elif rule_type == "regex_guard":
            try:
                matched = bool(re.search(pattern, test_input, re.IGNORECASE))
            except re.error:
                matched = pat_lower in p_lower
        elif rule_type == "instruction_fence":
            matched = any(x in p_lower for x in ["ignore previous", "override", "disregard"])
        elif rule_type == "canary_trap":
            matched = "bayora-" in p_lower or "canary" in p_lower

        if matched and action == "REDACT":
            sanitized = re.sub(re.escape(pattern), "[REDACTED]", test_input, flags=re.IGNORECASE)
        elif matched and action == "BLOCK":
            sanitized = "[BLOCKED BY DEFENSE POLICY]"

        latency = round((time.perf_counter() - start) * 1000, 2)
        return {
            "matched": matched,
            "action_taken": action if matched else "NONE",
            "sanitized_output": sanitized,
            "latency_ms": latency
        }
