from shared.agents.cortexa_agent import CortexaAgent
from shared.agents.bart_agent import BartAgent
from shared.agents.daphne_agent import DaphneAgent

AGENT_REGISTRY = {
    "cortexa": CortexaAgent(),
    "bart": BartAgent(),
    "daphne": DaphneAgent(),
}

def execute_agent_chain(agent_ids: list, user_input: str) -> list:
    """
    Runs a chain of agents using the same user input.

    Returns:
        List of step responses with agent labels.
    """
    steps = []

    for agent_id in agent_ids:
        agent = AGENT_REGISTRY.get(agent_id.lower())
        if not agent:
            steps.append({ "agent": agent_id, "output": "❌ Unknown agent." })
            continue

        try:
            result = agent.ask(user_input)
            steps.append({ "agent": agent.name, "output": result })
        except Exception as e:
            steps.append({ "agent": agent_id, "output": f"❌ Error: {e}" })

    return steps