from shared.agents.bart_agent import BartAgent
from shared.agents.cortexa_agent import CortexaAgent
from shared.agents.daphne_agent import DaphneAgent
from shared.system.atlas_core import Atlas

atlas = Atlas()

AGENT_MAP = {
    "bart": BartAgent(),
    "daphne": DaphneAgent(),
    "cortexa": CortexaAgent(),
}

def execute_chain(chain_steps: list) -> list:
    """
    Executes a sequence of agent prompt steps.

    Args:
        chain_steps (list): List of {"agent": str, "prompt": str}

    Returns:
        list: History of {"agent", "input", "output"}
    """
    history = []

    for step in chain_steps:
        agent_name = step.get("agent")
        prompt = step.get("prompt")

        if not atlas.is_safe():
            return [{"agent": "atlas", "input": "chain block", "output": "🚫 System not safe."}]

        agent = AGENT_MAP.get(agent_name.lower())
        if not agent:
            history.append({
                "agent": agent_name,
                "input": prompt,
                "output": f"❌ Unknown agent: {agent_name}"
            })
            continue

        output = agent.ask(prompt)
        history.append({
            "agent": agent_name,
            "input": prompt,
            "output": output
        })

    return history